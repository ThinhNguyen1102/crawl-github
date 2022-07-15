import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function TooltipPositioned(props) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-top`} bsPrefix="tooltip-custom">
          {props.placement}
        </Tooltip>
      }
    >
      {props.children}
    </OverlayTrigger>
  );
}

export default TooltipPositioned;
