export interface IProvince {
  name: string;
  code: number;
  divisionType: string;
  codename: string;
  phoneCode: number;
}

export interface IDistrict {
  provinceCode: number;
  districts: IProvince[];
}

export interface IWard {
  districtCode: number;
  wards: IProvince[];
}
