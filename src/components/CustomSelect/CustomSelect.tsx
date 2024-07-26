import "./CustomSelect.scss";
import arrow from "img/ic_down_arrow_circle.svg";
import cx from "classnames";

export default function CustomSelect({className, size = "m"}) {
  const classNames = cx("Search-input Custom-Select", `Search-input_size_${size}`, className);
  return (
    <div className={classNames}>
      <span style={{color: "white", opacity: "64%"}}>By Favorite</span>
      <img src={arrow} alt="arrow" />
    </div>
  );
}
