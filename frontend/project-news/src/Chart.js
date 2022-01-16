import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'

const Chart = ({trendData, keyword}) => {

    const [dates, setDates] = useState([])
    const [trendVal, setTrendVal] = useState([])
    const [colors, setColors] = useState([])
    const [annotation, setAnnotation] = useState({})
    const [title, setTitle] = useState('')

    const defaultColor = 'blue'
    const peakColor = 'red'

    const parseTrendData = () => {
        if (trendData.length === 0) return
        let peakSet = getPeakStartDates()
        let dates = []
        let trendVal = []
        let colors = []
        let peakMap = {}
        for (const[date, val] of Object.entries(trendData.keyword)) {
            dates.push(date)
            trendVal.push(val)

            if (peakSet.has(date)) {
                colors.push(peakColor)
                peakMap[date] = val
            } else {
                colors.push(defaultColor)
            }
        }

        setDates(dates)
        setTrendVal(trendVal)
        setColors(colors)
        annotatePeaks(peakMap)
        setTitle('Interest of "' + keyword + '" over time')
    }

    const annotatePeaks = (peaks) => {
        let annotations = []
        let idx = 1;
        for (const[date, val] of Object.entries(peaks)) {
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
        if (annotations.length !== annotation.length) {
            setAnnotation(annotations)
        }
    }

    const getPeakStartDates = () => {
        let peakSet = new Set()
        for (let peakDateRange of trendData.top_dates) {
            peakSet.add(peakDateRange.split(',')[0])
        }
        return peakSet
    }

    useEffect(() => {
        parseTrendData()
    }, [trendData])



    return (
        <div>
            <Plot id='chart'
                data={[
                    {
                        x: dates,
                        y: trendVal,
                        type: 'bar',
                        mode: 'bar+markers',
                        marker: {color: colors}
                    }
                ]}
                layout={{
                    autosize: true,
                    width: 1200,
                    height: 600,
                    title: {
                        text: title
                    },
                    yaxis: {
                        title: {
                            text: 'Interest Over Time'
                        }
                    },
                    annotations: annotation
                }}
            />
        </div>
    )

}

export default Chart