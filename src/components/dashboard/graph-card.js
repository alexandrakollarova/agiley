import React from 'react'
import {
  makeStyles,
  withStyles,
  Card
} from '@material-ui/core'
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Legend
} from '@devexpress/dx-react-chart-material-ui'
import { ArgumentScale, Animation, ValueScale } from '@devexpress/dx-react-chart'
import { curveCatmullRom, area } from 'd3-shape'
import { scalePoint } from 'd3-scale'
import { scaleLinear } from '@devexpress/dx-chart-core'
import { Palette } from '@devexpress/dx-react-chart'

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: '0 100px 80px rgba(0, 0, 0, 0.12)',
    borderRadius: 10
  },
  buffer: {
    padding: theme.spacing(3)
  }
}))

const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
    paddingBottom: 0
  }
})

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
)

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase)

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
    paddingRight: 20
  }
})

const Area = props => (
  <AreaSeries.Path
    path={area()
      .x(({ arg }) => arg)
      .y1(({ val }) => val)
      .y0(({ startVal }) => startVal)
      .curve(curveCatmullRom)
    }
    {...props}

  />
)

const format = obj => obj.tickFormat(1, null)
const scale = scaleLinear()
scale.ticks = () => Array.from(Array(100).keys())


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

  data.map(key => {
    if (key.status === 'todo') {
      projects.map(project => {
        const projectListTodo = sections.find(section => {
          if (section.projectId === project.id) {
            return section.title === 'todo'
          }
        })
        const title = project.title
        key[title] = projectListTodo.cards.length
      })
    }
    else if (key.status === 'in progress') {
      projects.map(project => {
        const projectListInProgress = sections.find(section => {
          if (section.projectId === project.id) {
            return section.title === 'in progress'
          }
        })
        const title = project.title
        key[title] = projectListInProgress.cards.length
      })
    }
    else if (key.status === 'done') {
      projects.map(project => {
        const projectListDone = sections.find(section => {
          if (section.projectId === project.id) {
            return section.title === 'done'
          }
        })
        const title = project.title
        key[title] = projectListDone.cards.length
      })
    }
  })

  const sortedData = data.sort((a, b) => (a.status > b.status) ? -1 : ((b.status > a.status) ? 1 : 0))

  return (
    <Card className={cardClasses.card}>
      <div className={cardClasses.buffer}>
        <Chart
          data={sortedData}
          className={classes.chart}
        >
          <Palette scheme={['#6774FF', '#FF911E', '#FEBB46', '#FFD647', '#D6DAE3', '#1631A4']} />
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis showTicks={false} indentFromAxis={20} />
          <ValueAxis indentFromAxis={20} tickFormat={format} />
          <ValueScale factory={() => scale} />
          {projects.map(project => {
            return (
              <AreaSeries
                key={project.title}
                name={project.title}
                valueField={project.title}
                argumentField="status"
                seriesComponent={Area}
              />
            )
          })}
          <Animation />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
        </Chart>
      </div>
    </Card>
  )
}

export default withStyles(chartStyles, { name: 'GraphCard' })(GraphCard)
