import config from '@/payload/config';
import { Card } from '@payloadcms/ui';
import { getPayload } from 'payload';

export async function UsersCount() {
  const payload = await getPayload({
    config,
  });

  const { totalDocs: totalUsers } = await payload.count({
    collection: 'users',
  });

  return <Card title="Users" actions={totalUsers} />;
}
