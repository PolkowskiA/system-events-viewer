import { levelDescriptions, levelLabels } from "../constants";
import {
  headerIntro,
  headerKicker,
  headerPanel,
  headerPanelLabel,
  headerPanelText,
  headerPanelValue,
  headerRoot,
  headerSubtitle,
  headerTitle,
} from "../styles";
import type { EventLevel } from "../types";

type HeaderProps = {
  minLevel: EventLevel;
};

export const Header = ({ minLevel }: HeaderProps) => (
  <header className={headerRoot}>
    <div className={headerIntro}>
      <p className={headerKicker}>System Events Viewer</p>
      <h1 className={headerTitle}>System events overview</h1>
      <p className={headerSubtitle}>
        Browse entries across levels and filter them by time.
      </p>
    </div>
    <div className={headerPanel}>
      <div>
        <p className={headerPanelLabel}>Current level filter</p>
        <p className={headerPanelValue}>{levelLabels[minLevel]}</p>
      </div>
      <div>
        <p className={headerPanelLabel}>Description</p>
        <p className={headerPanelText}>{levelDescriptions[minLevel]}</p>
      </div>
    </div>
  </header>
);
