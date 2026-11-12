const assert = require('node:assert/strict');
const test = require('node:test');
const { candidatePipeline } = require('./audit-legacy-schedules');

test('legacy audit reads review evidence without writing or collapsing distinct schedules', () => {
  const pipeline = candidatePipeline();
  assert.deepEqual(pipeline.map((stage) => Object.keys(stage)[0]), ['$group', '$match', '$sort']);
  assert.deepEqual(pipeline[0].$group._id, { title: '$title', startAt: '$startAt' });
  assert.deepEqual(pipeline[1].$match, { count: { $gt: 1 } });
  for (const field of ['streamerId', 'memberIds', 'endAt', 'isOfficial', 'contents', 'sourceUrl', 'updatedAt']) {
    assert.equal(pipeline[0].$group.entries.$push[field], `$${field}`);
  }
});
