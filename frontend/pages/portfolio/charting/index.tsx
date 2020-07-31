import { ReactElement } from "react";
import PageWrapper from "components/PageWrapper";
import PieChartIcon from "static/images/PieChart.svg";
import ExchangeIcon from "static/images/Exchange.svg";
import ArrowUp from "static/images/ArrowUp.svg";
import {
  Root,
  HorizontalContainer,
  IconContainer,
  Title,
  CompanyNameText,
  Ticker,
  DateStr,
  CurrentPriceText,
  PriceChange
} from "./styles";

function Charting(): ReactElement {
  const companyName = "Alphabet Inc Class A";
  const ticker = "GOOGL";
  const currentDateTime = "Jul. 24, 6:11 p.m. EDT";
  const previousPrice = 2680.24;
  const currentPrice = 2712.24;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercentage = Math.round((currentPrice - previousPrice) * 1000 / previousPrice) / 10;

  return (
    <Root>
      <HorizontalContainer marginTop={48}>
        <IconContainer>
          <PieChartIcon/>
        </IconContainer>
        <Title>
          Advanced Charting
        </Title>
      </HorizontalContainer>

      <HorizontalContainer marginTop={48}>
        <CompanyNameText>{companyName}</CompanyNameText>
        <div>
          <ExchangeIcon/>
        </div>
      </HorizontalContainer>
      <HorizontalContainer marginTop={0}>
        <Ticker>{ticker}</Ticker>
        <DateStr>{currentDateTime}</DateStr>
      </HorizontalContainer>
      <HorizontalContainer marginTop={8}>
        <CurrentPriceText>{`$${currentPrice}`}</CurrentPriceText>
        <PriceChange isNegative={priceChange < 0}>
          {priceChange > 0 ? `+${priceChange}` : priceChange}
        </PriceChange>
        <ArrowUp/>
        <PriceChange isNegative={priceChangePercentage < 0}>{`${priceChangePercentage}%`}</PriceChange>
      </HorizontalContainer>

    </Root>
  );
}

export default PageWrapper(Charting);