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
  projects
}) {
  const cardClasses = useStyles()

  let data = []

  projects[0].lists.map(list => {
    data.push({
      status: list.title
    })
  })

  data.map(key => {
    if (key.status === 'Todo') {
      projects.map(project => {
        const projectListTodo = project.lists.find(list => list.title === 'Todo')
        const title = project.title
        key[title] = projectListTodo.cards.length
      })
    }
    else if (key.status === 'In-progress') {
      projects.map(project => {
        const projectListInProgress = project.lists.find(list => list.title === 'In-progress')
        const title = project.title
        key[title] = projectListInProgress.cards.length
      })
    }
    else if (key.status === 'Done') {
      projects.map(project => {
        const projectListDone = project.lists.find(list => list.title === 'Done')
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
