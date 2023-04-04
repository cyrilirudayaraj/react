import ConversionUtil from './ConversionUtil';
import { MockData } from '../services/__mocks__/MockData';
import { Shape } from '../types';

interface PayloadType {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

const payload: PayloadType = {
  id: 1,
  name: 'Sample',
  description: '',
  isActive: true,
  createdAt: new Date(),
};

describe('ConversionUtil tests', () => {
  it('should convert map to drop down list', () => {
    expect(
      ConversionUtil.convertMapToDropDownList(MockData.PRIORITIES)
    ).toHaveLength(5);
  });
  it('should convert map to drop down list in Id Name format', () => {
    expect(
      ConversionUtil.convertMapToDropDownListInIdNameFormat(
        MockData.CLAIMRULECATEGORYLIST
      )
    ).toHaveLength(5);
  });
  it('should convert map to drop down list with keys', () => {
    expect(
      ConversionUtil.convertMapToDropDownList(
        MockData.USERS,
        'userName',
        'firstName'
      )
    ).toHaveLength(8);
  });
  it('should convert drop down list to values', () => {
    const objArr: Shape[] = [
      {
        text: 'First',
        value: '1',
      },
      {
        text: 'Second',
        value: '2',
      },
    ];
    expect(ConversionUtil.convertDropDownListToValues(objArr)).toHaveLength(2);
  });
  it('should convert values to payload', () => {
    expect(ConversionUtil.convertValuesToPayload(payload)).toBeDefined();
  });
  it('should convert minutes to hours and minutes', () => {
    expect(ConversionUtil.convertMinsToHm('70')).toBeDefined();
    expect(ConversionUtil.convertMinsToHm('70')).toEqual('1h 10m');
    expect(ConversionUtil.convertMinsToHm('70')).not.toEqual('2h 10m');
  });
  it('should convert minutes to days, hours and minutes', () => {
    expect(ConversionUtil.convertMinsToDhm('1530')).toEqual('1d 1h 30m');
  });
  it('should convert html to plain text', () => {
    const str = '<div>Hello <span>World!</span></div>';
    expect(ConversionUtil.convertHtmlToPlainText(str)).toEqual('Hello World!');
  });
  it('should get list of key values', () => {
    const objArr = [
      {
        id: 1,
        name: 'First',
      },
      {
        id: 2,
        name: 'Second',
      },
    ];
    expect(ConversionUtil.getListOfKeyValues(objArr, 'id')).toHaveLength(2);
  });
  it('should convert to pretty json', () => {
    const str = '{name:"Atlas"}';
    expect(ConversionUtil.getPrettyJson(str)).toBeDefined();
  });
});
