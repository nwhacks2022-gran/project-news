import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const Chart = ({trendData}) => {

    const [dates, setDates] = useState([])
    const [trendVal, setTrendVal] = useState([])
    const [colors, setColors] = useState([])
    const [peakDateSet, setPeakDates] = useState(new Set());
    const [peakXY, setPeakMap] = useState({});
    const [layout, setLayout] = useState({})
    const [ignore, forceUpdate] = useState(0);

    const defaultColor = 'blue'
    const peakColor = 'red'

    const parseTrendData = () => {
        if (trendData.length === 0) return

        getPeakStartDates()
        let dates = []
        let trendVal = []
        let colors = []
        let peakMap = {}
        for (const[date, val] of Object.entries(trendData.keyword)) {
            dates.push(date)
            trendVal.push(val)

            if (peakDateSet.has(date)) {
                colors.push(peakColor)
                peakMap[date] = val
            } else {
                colors.push(defaultColor)
            }
        }

        setDates(dates)
        setTrendVal(trendVal)
        setColors(colors)
        setPeakMap(peakMap)
        forceUpdate(ignore + 1)
    }

    const annotatePeaks = () => {
        let annotations = []
        let idx = 1;
        for (const[date, val] of Object.entries(peakXY)) {
            annotations.push({
                x: date,
                y: val,
                xref: 'x',
                yref: 'y',
                text: 'Peak ' + idx,
                ax: 0,
                ay: -20,
                showarrow: true,
            })
            idx++
        }
        let newLayout = {'annotations': annotations}
        if (annotations.length !== layout.length) {
            setLayout(newLayout)
        }
        return newLayout
    }

    const getPeakStartDates = () => {
        let peakSet = new Set()
        for (let peakDateRange of trendData.top_dates) {
            peakSet.add(peakDateRange.split(',')[0])
        }

        setPeakDates(peakSet)
    }

    useEffect(() => {
        parseTrendData()
        annotatePeaks()
    }, [trendData])

    useEffect(() => {
        annotatePeaks()
    }, [ignore])


    return (
        <Plot
            data={[
                {
                    x: dates,
                    y: trendVal,
                    type: 'bar',
                    mode: 'bar+markers',
                    marker: {color: colors}
                }
            ]}
            layout={{layout}}
        />
    )

}

export default Chart