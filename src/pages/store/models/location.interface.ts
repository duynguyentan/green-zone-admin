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

export interface ISearchAddress {
  predictions: {
    place_id: string;
    description: string;
    compound?: {
      commune: string;
      district: string;
      province: string;
    };
  }[];
  status: string;
}

export interface ILatLong {
  result: {
    geometry: {
      location: {
        lat: string;
        lng: string;
      };
    };
  };
}
