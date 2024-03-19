import {AdvanceApiTime, TimeAPI, TimeSkew} from './TimeAPI';
import nock from 'nock';

describe('TimeAPI', () => {
  describe('getTime', () => {
    afterEach(() => nock.cleanAll());

    beforeEach(() => {
      nock.cleanAll();

      nock(global.SIWC_REST_URL)
        .persist()
        .get(TimeAPI.URL.TIME)
        .query(true)
        .reply(() => {
          const date = new Date('2015-01-07T23:47:25.201Z');
          return [
            200,
            JSON.stringify({
              data: {
                epoch: date.getTime() / 1000,
                iso: date.toISOString(),
              },
            }),
          ];
        });

      nock(global.REST_URL)
        .persist()
        .get(`/brokerage${TimeAPI.URL.TIME}`)
        .query(true)
        .reply(() => {
          const date = new Date('2015-01-07T23:47:25.201Z');
          return [
            200,
            JSON.stringify({
              epochMillis: Math.floor(date.getTime()).toString(),
              epochSeconds: Math.floor(date.getTime() / 1000).toString(),
              iso: date.toISOString(),
            }),
          ];
        });
    });

    it('returns decimal seconds since Unix Epoch', async () => {
      const time = await new TimeAPI(global.SIWC_REST_URL, global.REST_URL).getTime();
      const expected: TimeSkew = {
        epoch: 1420674445.201,
        iso: '2015-01-07T23:47:25.201Z',
      };

      expect(time).toEqual(expected);
    });

    it('returns milis and seconds of current time', async () => {
      const time = await new TimeAPI(global.SIWC_REST_URL, global.REST_URL).getAdvanceApiTime();
      const expected: AdvanceApiTime = {
        epochMillis: '1420674445201',
        epochSeconds: '1420674445',
        iso: '2015-01-07T23:47:25.201Z',
      };

      expect(time).toEqual(expected);
    });
  });
});
