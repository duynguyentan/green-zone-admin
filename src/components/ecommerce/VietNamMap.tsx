import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import vietnamMap from '../../common/maps/vietnam-geo.json';

export default function VietnamMap() {
  const [tooltip, setTooltip] = useState<{
    name: string;
    orderCount: number;
  } | null>(null);

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [106, 16], // Canh giữa bản đồ
          scale: 3200, // Scale để bản đồ không quá to hoặc nhỏ
        }}
        width={900}
        height={900}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={vietnamMap}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // const provinceName = geo.properties.name;
              // const provinceData = orderByProvince.find(
              //   (p) => p.province === provinceName
              // );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  // onMouseEnter={() =>
                  //   setTooltip({
                  //     name: provinceName,
                  //     orderCount: provinceData ? provinceData.orderCount : 0,
                  //   })
                  // }
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { fill: '#D0D5DD', stroke: '#FFF' },
                    hover: { fill: '#039855', cursor: 'pointer' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute bg-white shadow-md px-3 py-2 rounded-lg text-sm text-gray-900"
          style={{ top: '10px', left: '10px' }}
        >
          <strong>{tooltip.name}</strong>: {tooltip.orderCount} đơn hàng
        </div>
      )}
    </div>
  );
}
