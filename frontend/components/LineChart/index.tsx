import React, { ReactElement } from "react";
import moment from "moment";
import LineChartGraph from "./LineChartGraph";
import { X_LABEL_COUNT, Y_LABEL_COUNT, CHART_HEIGHT } from "./constants";
import {
  Root,
  LineChartFrame,
  FrameBackgroundGridLine,
  LineChartGraphContainer,
  YLabelsContainer,
  YLabelsText,
  XLabelContainer,
  XLabelsText,
  ColumnsContainer,
  Column,
  DataPoint
} from "./styles";


export interface TimeSeriesData {
  timestamp: number;
  value: number;
}

interface LineChartProps {
  isTimeSeries?: boolean;
  timeSeriesDataList: TimeSeriesData[]
}

class LineChart extends React.PureComponent<LineChartProps> {

  get xLabels(): string[] {
    const { timeSeriesDataList } = this.props;
    const endTimestamp = timeSeriesDataList[0].timestamp;
    const startTimestamp = timeSeriesDataList[timeSeriesDataList.length -1].timestamp;
    const duration = endTimestamp - startTimestamp;

    // we label X in the middle, so margin 1/2 of the in-between distance to the start and end, distance between labels
    // are as usual
    const timeSegment = duration / (X_LABEL_COUNT * 2);

    // From left (earlier) to right (later)
    return [...Array(X_LABEL_COUNT).keys()].map(
      i => moment(endTimestamp - timeSegment - i * 2 * timeSegment).format("M/D/YYYY H:mm")
    );
  }

  get yLabels(): string[] {
    const { timeSeriesDataList } = this.props;

    const maxValue = Math.max(...timeSeriesDataList.map(data => data.value));
    const minValue = Math.min(...timeSeriesDataList.map(data => data.value));
    let maxLabel = Math.ceil(maxValue / 100) * 100; // round max up to nearest 100
    let minLabel = Math.floor(minValue / 100) * 100; // round min down to nearest 100

    if (maxValue < 100) {
      maxLabel = Math.ceil(maxValue / 10) * 10; // round max up to nearest 10
      minLabel = Math.floor(minValue / 10) * 10; // round min down to nearest 10
    }

    const labelDistance = (maxLabel - minLabel) / (Y_LABEL_COUNT - 1);

    // From max (top) to min (down)
    return [...Array(Y_LABEL_COUNT).keys()].map(
      i => (Math.round(maxLabel - i * labelDistance)).toString()
    );
  }

  get isDropping(): boolean {
    const { timeSeriesDataList } = this.props;

    return timeSeriesDataList[0].value >= timeSeriesDataList[timeSeriesDataList.length - 1].value;
  }

  render(): ReactElement {
    const { timeSeriesDataList } = this.props;
    const { yLabels } = this;

    if (!timeSeriesDataList) {
      return <div>Loading</div>;
    }

    // Consider height of the chart is 100%, this calculates a list of percentage of height of each points
    const percentageHeights = timeSeriesDataList.map(data => (
      (data.value - parseInt(yLabels[Y_LABEL_COUNT - 1], 10)) /
      (parseInt(yLabels[0], 10) - parseInt(yLabels[Y_LABEL_COUNT - 1], 10))
    ));

    return (
      <Root>
        <YLabelsContainer>
          {[...Array(Y_LABEL_COUNT).keys()].map(i => (
            <YLabelsText key={i} count={i}>
              {this.yLabels[i]}
            </YLabelsText>
          ))}
        </YLabelsContainer>

        <LineChartFrame>
          <ColumnsContainer>
            {timeSeriesDataList.map(data => (
              <Column count={timeSeriesDataList.length}>
                <DataPoint
                  height={
                    (
                      (data.value - parseInt(yLabels[Y_LABEL_COUNT - 1], 10)) /
                      (parseInt(yLabels[0], 10) - parseInt(yLabels[Y_LABEL_COUNT - 1], 10))
                    ) * CHART_HEIGHT
                  }
                  isBad={this.isDropping}
                />
              </Column>
            ))}
          </ColumnsContainer>
          {  // We do not draw last line to prevent overlapping with the background frame
            [...Array(Y_LABEL_COUNT - 1).keys()].map(i => (
              <FrameBackgroundGridLine key={i} count={i} />
            ))
          }
          <LineChartGraphContainer>
            <LineChartGraph percentageHeights={percentageHeights} />
          </LineChartGraphContainer>
        </LineChartFrame>

        <XLabelContainer>
          {[...Array(X_LABEL_COUNT).keys()].map(i => (
            <XLabelsText key={i}>
              {this.xLabels[i]}
            </XLabelsText>
          ))}
        </XLabelContainer>
      </Root>
    );
  }
}

export default LineChart;
