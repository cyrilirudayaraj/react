import StringUtil from './StringUtil';

describe('StringUtil tests', () => {
  it('should return true when the string is null or empty', () => {
    expect(StringUtil.isNullOrEmpty(null)).toBe(true);
  });
  it('should return true when the string is null or empty', () => {
    expect(StringUtil.isNullOrEmpty('')).toBe(true);
  });
  it('should return false when the string is not null or not empty', () => {
    expect(StringUtil.isNullOrEmpty('TEST')).toBe(false);
  });
  it('should return true when both the strings are equal', () => {
    expect(StringUtil.equalsIgnoreCase('str', 'STR')).toBe(true);
  });
  it('should return false when both the strings are not equal', () => {
    expect(StringUtil.equalsIgnoreCase('str1', 'str2')).toBe(false);
  });
  it('should format business requirement id as expected', () => {
    expect(StringUtil.formatBRID(1)).toBe('BR-000001');
  });
  it('should format business requirement id as expected', () => {
    expect(StringUtil.formatBRID('100')).toBe('BR-000100');
  });
  it('should return empty business requirement id as expected', () => {
    expect(StringUtil.formatBRID('')).toBe('');
  });
  it('should format task id as expected', () => {
    expect(StringUtil.formatTaskID('100')).toBe('T-100');
  });
  it('should return empty task id as expected', () => {
    expect(StringUtil.formatTaskID('')).toBe('');
  });
  it('should return empty decision table id as expected', () => {
    expect(StringUtil.formatDecisionTableId('')).toBe('');
  });
  it('should return empty formatDate as expected', () => {
    expect(StringUtil.formatDate(null)).toBe('');
  });
  it('should return formatDate as expected', () => {
    expect(StringUtil.formatDate(new Date('October 13, 2018 11:13:00'))).toBe(
      '10/13/2018'
    );
  });
  it('should return convertToYN id as Y', () => {
    expect(StringUtil.convertToYN(true)).toBe('Y');
  });
  it('should return convertToYN as N', () => {
    expect(StringUtil.convertToYN(null)).toBe('N');
  });
  it('should return convertToBoolean as true ', () => {
    expect(StringUtil.convertToBoolean('y')).toBe(true);
  });
  it('should return returnHyphenIfEmpty as expected', () => {
    expect(StringUtil.returnHyphenIfEmpty('test')).toBe('test');
  });
  it('should return getStatusClassName as expected', () => {
    expect(StringUtil.getStatusClassName('1')).toBe('status_1');
  });
  it('should return getJIRAIdUrl as expected', () => {
    expect(StringUtil.getJIRAIdUrl('COLRDD-12345')).toContain('http');
  });
  it('should return getRTTaskIdUrl as expected', () => {
    expect(StringUtil.getRTTaskIdUrl('12345')).toContain('http');
  });
  it('should return getRTRuleIdUrl as expected', () => {
    expect(StringUtil.getRTRuleIdUrl('1.2345')).toContain('http');
  });
  it('should return getOriginatingSystemUrl as expected', () => {
    expect(StringUtil.getOriginatingSystemUrl('3', 'COLRDD-12345')).toContain(
      'http'
    );
  });
});
