'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

export default function IntradayEChart({
  data,
}: {
  data: { date: string; nav: number }[];
}) {
  function fixDate(d: string) {
    const [day, month, year] = d.split('-');
    return `${year}-${month}-${day}`;
  }
  const seriesData = data.map((d) => [
    new Date(fixDate(d.date)),
    Number(d.nav),
  ]);

  const values = data.map((d) => d.nav);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  const { fontSmall, fontMedium, fontLarge, lineWidth } = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;

    if (width < 500) {
      return { fontSmall: 8, fontMedium: 10, fontLarge: 12, lineWidth: 1 };
    } else if (width < 900) {
      return { fontSmall: 9, fontMedium: 14, fontLarge: 16, lineWidth: 1 };
    } else {
      return { fontSmall: 13, fontMedium: 15, fontLarge: 18, lineWidth: 3 };
    }
  }, []);

  const option = {
    backgroundColor: 'transparent',

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.25)',
      borderWidth: 1,
      padding: 10,
      position: function (
        point: any,
        params: any,
        dom: any,
        rect: any,
        size: any
      ) {
        const chartWidth = size.viewSize[0];
        const tooltipWidth = dom.offsetWidth;

        let x = point[0];
        const y = '5%';

        // If tooltip overflows right edge → shift left
        if (x + tooltipWidth > chartWidth) {
          x = chartWidth - tooltipWidth - 10; // padding from right
        }

        // If tooltip overflows left edge → clamp to 10px
        if (x < 10) {
          x = 10;
        }

        return [x, y];
      },
      extraCssText: 'border-radius: 10px; backdrop-filter: blur(6px);',
      textStyle: { color: '#e2e8f0', fontSize: fontSmall },

      formatter: (params: any) => {
        const p = params[0];
        const date = new Date(p.value[0]);

        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        return `
          <div style="display:flex; gap:2px;">
           <div style="color:#94a3b8;">
              NAV
            </div>
            <div style=" color:#22c55e;">
              ₹${p.value[1]}
            </div>
            <span>|</span>
            <div style="color:#f1f5f9;">
              ${formattedDate}
            </div>
          </div>
        `;
      },
    },

    grid: { left: '4%', right: '4%', bottom: '6%', top: '10%' },

    // FIXED
    xAxis: {
      type: 'time',
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: 'rgba(203, 213, 225, 0.4)' }, },
    },

    // FIXED
    yAxis: {
      type: 'value',
      min: minVal - 2,
      max: maxVal + 2,
      axisLabel: { show: false },
      splitLine: { lineStyle: { color: 'rgba(253, 253, 253, 0)' } },
    },

    series: [
      {
        type: 'line',
        data: seriesData,
        smooth: 0.9,
        symbol: 'none',
        lineStyle: {
          lineWidth: 1.2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#22c55e' },
              { offset: 1, color: '#16a34a' },
            ],
          },
        },
        
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
  );
}
