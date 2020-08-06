import React from 'react'
import {
  makeStyles,
  withStyles,
  Card,
  Typography
} from '@material-ui/core'
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
  Legend
} from '@devexpress/dx-react-chart-material-ui'
import { ArgumentScale, Animation } from '@devexpress/dx-react-chart'
import {
  curveCatmullRom,
  area,
} from 'd3-shape'
import { scalePoint } from 'd3-scale'

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
  },
  buffer: {
    padding: theme.spacing(3)
  }
}))

const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row'
  }
})

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
)

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const legendLabelStyles = () => ({
  label: {
    whiteSpace: 'nowrap'
  }
})

const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
)

const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase)

const chartStyles = () => ({
  chart: {
    paddingRight: '20px'
  }
})

const Area = props => (
  <AreaSeries.Path
    {...props}
    path={area()
      .x(({ arg }) => arg)
      .y1(({ val }) => val)
      .y0(({ startVal }) => startVal)
      .curve(curveCatmullRom)}
  />
)

function GraphCard({
  classes,
  projects,
  sections
}) {
  const cardClasses = useStyles()

  let data = []

  sections.map(section => {
    data.push({
      status: section.title
    })
  })
  console.log(data)

  const testData = [
    { month: 'Jan', appStore: 101, googlePlay: 13 },
    { month: 'Feb', appStore: 89, googlePlay: 15 },
    { month: 'Mar', appStore: 107, googlePlay: 20 },
    { month: 'Apr', appStore: 113, googlePlay: 17 },
    { month: 'May', appStore: 105, googlePlay: 21 },
    { month: 'Jun', appStore: 91, googlePlay: 22 },
    { month: 'Jul', appStore: 110, googlePlay: 23 },
    { month: 'Aug', appStore: 111, googlePlay: 25 },
    { month: 'Sep', appStore: 112, googlePlay: 27 },
    { month: 'Oct', appStore: 111, googlePlay: 30 },
    { month: 'Nov', appStore: 120, googlePlay: 35 },
    { month: 'Dec', appStore: 160, googlePlay: 45 },
  ]

  data.map(key => {
    if (key.status === 'Todo') {
      projects.map(project => {
        const projectListTodo = sections.find(section => section.title === 'Todo')
        const title = project.title
        key[title] = projectListTodo.cards.length
      })
    }
    else if (key.status === 'In-progress') {
      projects.map(project => {
        const projectListInProgress = sections.find(section => section.title === 'In-progress')
        const title = project.title
        key[title] = projectListInProgress.cards.length
      })
    }
    else if (key.status === 'Done') {
      projects.map(project => {
        const projectListDone = sections.find(section => section.title === 'Done')
        const title = project.title
        key[title] = projectListDone.cards.length
      })
    }
  })

  return (
    <Card className={cardClasses.card}>
      <div className={cardClasses.buffer}>
        <Chart
          data={data}
          className={classes.chart}
        >
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis />
          <ValueAxis />
          {
            projects.map(project => {
              return (
                <AreaSeries
                  key={project.title}
                  name={project.title}
                  valueField={project.title}
                  argumentField="status"
                  seriesComponent={Area}
                />
              )
            })
          }
          <Animation />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          {/* <Title text="iOS App Store vs Google Play Revenue in 2012" /> */}
        </Chart>
      </div>
    </Card>
  )
}

export default withStyles(chartStyles, { name: 'GraphCard' })(GraphCard)
