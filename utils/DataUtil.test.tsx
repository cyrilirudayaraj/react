import DataUtil from './DataUtil';
import Constants from '../constants/AppConstants';

const winObj: any = window;
winObj.globalVars = { username: 'mruser', edit: 'true' };

describe('test <DataUtil>', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV, REACT_APP_USER: 'devuser' }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });
  const getCurrentDate = jest.spyOn(DataUtil, 'getCurrentDate');

  it('should format data', () => {
    const currentdate = '02/12/2021';
    getCurrentDate.mockImplementation(() => currentdate);
    const record = [{ id: 1, isChecked: true }];
    const formatted = DataUtil.formatDeleteData(record);
    const deletedRecord = formatted.filter(
      (rec: any) => rec.deletedBy === 'mruser' && rec.deleted === currentdate
    );
    expect(deletedRecord.length).toBe(record.length);
  });

  it('should format data to be updated', () => {
    const currentdate = '02/12/2021';
    getCurrentDate.mockImplementation(() => currentdate);
    const record = [{ archiveDate: 1, isChecked: true }];
    const datechosen = '02/20/2021';
    const comments = 'test-coverage';
    const emptycomments = '';
    const segment =
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.BACKWARD_COMPATIBILITY;

    const formattedcase1 = DataUtil.formatMoveToData(
      record,
      datechosen,
      comments,
      segment
    );
    const movetoRecord1 = formattedcase1.filter(
      (rec: any) =>
        rec.archiveDate === datechosen && rec.archiveComment === comments
    );
    expect(movetoRecord1.length).toBe(record.length);

    const formattedcase2 = DataUtil.formatMoveToData(
      record,
      datechosen,
      comments,
      segment
    );
    const movetoRecord2 = formattedcase2.filter(
      (rec: any) =>
        rec.archiveDate === datechosen && rec.archiveComment === comments
    );
    expect(movetoRecord2.length).toBe(record.length);

    const formattedcase3 = DataUtil.formatMoveToData(
      record,
      datechosen,
      emptycomments,
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING
    );
    const movetoRecord3 = formattedcase3.filter(
      (rec: any) => rec.dualMaintStartDate === datechosen
    );
    expect(movetoRecord3.length).toBe(record.length);

    const formattedcase4 = DataUtil.formatMoveToData(
      record,
      datechosen,
      emptycomments,
      segment
    );
    const movetoRecord4 = formattedcase4.filter(
      (rec: any) => rec.archiveDate === datechosen
    );
    expect(movetoRecord4.length).toBe(record.length);
  });
});
