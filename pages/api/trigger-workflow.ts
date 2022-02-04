// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Connection, WorkflowClient } from '@temporalio/client';
import { example } from '../../temporal-src/workflows';

type Data = {
  plainText: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const connection = new Connection({
    // // Connect to localhost with default ConnectionOptions.
    // // In production, pass options to the Connection constructor to configure TLS and other settings:
    address: process.env['TEMPORAL_CLUSTER_HOSTPORT'] || 'localhost:7233',
  });

  const client = new WorkflowClient(connection.service, {
    namespace: 'default',
  });

  client.start(example, {
    args: ['Temporal'], // type inference works! args: [name: string]
    taskQueue: 'tutorial',
    // in practice, use a meaningful business id, eg customerId or transactionId
    workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
  }).then(handle => {
    res.status(200).json({ plainText: `Started workflow ${handle.workflowId}` });
  }).catch(err => {
    res.status(500).json({ plainText: `Error occurred: ${err.message}` });
  })
}
