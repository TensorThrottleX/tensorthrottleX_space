import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export const dynamic = 'force-dynamic';

type HealthStatus = 'ok' | 'error';

export async function GET() {
    const startedAt = Date.now();

    try {
        /* ------------------------------------------------------------ */
        /* 1. Environment checks                                        */
        /* ------------------------------------------------------------ */

        const NOTION_TOKEN = process.env.NOTION_TOKEN;
        const FEED_DB_ID = process.env.NOTION_FEED_DB_ID;

        if (!NOTION_TOKEN || !FEED_DB_ID) {
            return NextResponse.json(
                {
                    status: 'error',
                    stage: 'env',
                    message: 'Missing NOTION_TOKEN or NOTION_FEED_DB_ID',
                },
                { status: 500 }
            );
        }

        /* ------------------------------------------------------------ */
        /* 2. Notion client setup                                       */
        /* ------------------------------------------------------------ */

        const notion = new Client({ auth: NOTION_TOKEN });

        /* ------------------------------------------------------------ */
        /* 3. Database query check (auth + access validation)            */
        /* ------------------------------------------------------------ */

        const response = await notion.databases.query({
            database_id: FEED_DB_ID,
            page_size: 10,
        });

        /* ------------------------------------------------------------ */
        /* 4. Schema sanity check                                       */
        /* ------------------------------------------------------------ */

        const sample = response.results[0] as any | undefined;

        if (sample) {
            const props = sample.properties ?? {};

            const requiredProps = ['Title', 'Slug', 'Published', 'Type'];
            const missing = requiredProps.filter((p) => !(p in props));

            if (missing.length > 0) {
                return NextResponse.json(
                    {
                        status: 'error',
                        stage: 'schema',
                        message: 'Missing required Notion properties',
                        missing,
                    },
                    { status: 500 }
                );
            }
        }

        /* ------------------------------------------------------------ */
        /* 5. Count by type (debug insight)                              */
        /* ------------------------------------------------------------ */

        const counts = {
            total: response.results.length,
            post: 0,
            project: 0,
            research: 0,
            note: 0,
            status: 0,
            system: 0,
            unknown: 0,
        };

        for (const r of (response.results as any[])) {
            const type = r.properties?.Type?.select?.name?.toLowerCase() ?? 'unknown';

            if (type in counts) {
                // @ts-ignore - dynamic key access
                counts[type]++;
            } else {
                // @ts-ignore
                counts.unknown++;
            }
        }

        /* ------------------------------------------------------------ */
        /* 6. Success response                                          */
        /* ------------------------------------------------------------ */

        return NextResponse.json({
            status: 'ok' as HealthStatus,
            notion: 'reachable',
            database: 'reachable',
            counts,
            latency_ms: Date.now() - startedAt,
            timestamp: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json(
            {
                status: 'error' as HealthStatus,
                stage: 'runtime',
                message: err?.message ?? 'Unknown error',
            },
            { status: 500 }
        );
    }
}
