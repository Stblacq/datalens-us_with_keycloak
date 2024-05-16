import {raw} from 'objection';
import Entry from '../../../db/models/entry';
import {ServiceArgs} from '../../new/types';
import {
    DEFAULT_QUERY_TIMEOUT,
    EXTENDED_QUERY_TIMEOUT,
    RETURN_RELATION_COLUMNS,
} from '../../../const';
import {getReplica} from '../../new/utils';
import {EntryScope} from '../../../db/models/new/entry/types';

export enum RelationDirection {
    Parent = 'parent',
    Child = 'child',
}

type GetRelatedEntriesData = {
    entryIds: string[];
    direction?: RelationDirection;
    extendedTimeout?: boolean;
};

type GetRelatedEntriesResult = {
    entryId: string;
    key: string;
    scope: EntryScope;
    type: string;
    createdAt: string;
    meta: Record<string, unknown>;
    public: boolean;
    tenantId: string;
    workbookId: string | null;
    depth: number;
};

export async function getRelatedEntries(
    {ctx, trx}: ServiceArgs,
    {
        entryIds,
        direction = RelationDirection.Parent,
        extendedTimeout = false,
    }: GetRelatedEntriesData,
) {
    ctx.log('GET_RELATED_ENTRIES_RUN');

    const endToStart = direction === RelationDirection.Parent;

    const relatedEntries = (await Entry.query(getReplica(trx))
        .withRecursive('relatedEntries', (qb) => {
            qb.select(['fromId', 'toId', raw('1 depth')])
                .from('links')
                .join('entries', 'entries.entryId', endToStart ? 'links.toId' : 'links.fromId')
                .where({isDeleted: false})
                .whereIn(endToStart ? 'links.fromId' : 'links.toId', entryIds)
                .union((qbx) => {
                    qbx.select(['l.fromId', 'l.toId', raw('depth + 1')])
                        .from('links as l')
                        .join(
                            'relatedEntries',
                            endToStart ? 'relatedEntries.toId' : 'relatedEntries.fromId',
                            endToStart ? 'l.fromId' : 'l.toId',
                        )
                        .join('entries', 'entries.entryId', endToStart ? 'l.toId' : 'l.fromId')
                        .where('isDeleted', false)
                        .where('depth', '<', 5);
                });
        })
        .select()
        .from((qb) => {
            qb.select(
                raw('distinct on (??) ??', [
                    'entries.entryId',
                    RETURN_RELATION_COLUMNS.concat('entries.created_at'),
                ]),
            )
                .from('relatedEntries')
                .join(
                    'entries',
                    endToStart ? 'relatedEntries.toId' : 'relatedEntries.fromId',
                    'entries.entryId',
                )
                .join('revisions', 'entries.savedId', 'revisions.revId')
                .as('re');
        })
        .orderBy('depth')
        .timeout(
            extendedTimeout ? EXTENDED_QUERY_TIMEOUT : DEFAULT_QUERY_TIMEOUT,
        )) as unknown[] as GetRelatedEntriesResult[];

    ctx.log('GET_RELATED_ENTRIES_DONE', {
        amount: relatedEntries && relatedEntries.length,
    });

    return relatedEntries;
}
