import React, { Profiler, Fragment, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { css, cx } from "emotion";
// import styled from "@emotion/styled";
import styled from "styled-components";

import "./styles.css";

function ComponentWithCSSFile(props) {
  return <div {...props} className={`red ${props.className}`} />;
}

function ComponentWithCSSFileBlue(props) {
  return <ComponentWithCSSFile {...props} className="blue" />;
}

function StyledIntermediate(props) {
  return <Styled {...props} />;
}

const StyledIntermediateBlue = styled(StyledIntermediate)`
  background-color: blue;
  color: white;
`;

const Styled = styled.div`
  background-color: red;
  color: white;
`;

const StyledBlue = styled(Styled)`
  background-color: blue;
  color: white;
`;

const StyledDynamic = styled.div`
  font-size: ${props => props.i}px;
`;

const blue = css`
  background-color: blue;
  color: white;
`;

const red = css`
  background-color: red;
  color: white;
`;

function Emotion(props) {
  return <div {...props} className={`${red} ${props.className}`} />;
}

function EmotionBlue(props) {
  return <Emotion {...props} className={blue} />;
}

function EmotionWithCX(props) {
  return <div {...props} className={cx(red, props.className)} />;
}

function EmotionWithCXBlue(props) {
  return <EmotionWithCX {...props} className={cx(blue, props.className)} />;
}

function EmotionInside(props) {
  const className = css`
    background-color: red;
    color: white;
  `;
  return <div {...props} className={cx(className, props.className)} />;
}

function EmotionInsideBlue(props) {
  const className = css`
    background-color: blue;
    color: white;
  `;
  return (
    <EmotionInside {...props} className={cx(className, props.className)} />
  );
}

function EmotionInsideDynamic(props) {
  const className = css`
    font-size: ${props.i}px;
  `;
  return <div {...props} className={cx(className, props.className)} />;
}

const maps = {
  mount: {},
  update: {}
};

function App() {
  const [updates, update] = useReducer((_, v) => v, 0);
  const length = 199;
  useEffect(() => {
    if (updates < 2) {
      update(updates + 1);
    }
  }, [updates]);
  const onRender = (id, phase, duration, baseDuration) => {
    const map = maps[phase];
    const time = phase === "mount" ? baseDuration : duration;
    map[id] = map[id] ? map[id] + time : time;
  };
  const mountList = Object.entries(maps.mount).sort((a, b) => a[1] - b[1]);
  const updateList = Object.entries(maps.update).sort((a, b) => a[1] - b[1]);
  const emotionMethods = [
    "EmotionInside",
    "EmotionInsideBlue",
    "EmotionInsideDynamic"
  ];
  const styledMethods = [
    "StyledIntermediate",
    "StyledIntermediateBlue",
    "StyledDynamic"
  ];
  return (
    <>
      <ComponentWithCSSFileBlue>
        Component with CSS File should be blue
      </ComponentWithCSSFileBlue>
      <StyledIntermediateBlue>
        Styled component with intermediate should be blue
      </StyledIntermediateBlue>
      <StyledBlue>Styled component should be blue</StyledBlue>
      <EmotionBlue>Emotion component should be blue</EmotionBlue>
      <EmotionWithCXBlue>
        Emotion component with CX helper should be blue
      </EmotionWithCXBlue>
      {Array.from({ length }).map(
        (_, key) =>
          true && (
            <Fragment key={key}>
              <Profiler id="ComponentWithCSSFile" onRender={onRender}>
                <ComponentWithCSSFile />
              </Profiler>
              <Profiler id="ComponentWithCSSFileBlue" onRender={onRender}>
                <ComponentWithCSSFileBlue />
              </Profiler>
              <Profiler id="Emotion" onRender={onRender}>
                <Emotion />
              </Profiler>
              <Profiler id="EmotionBlue" onRender={onRender}>
                <EmotionBlue />
              </Profiler>
              <Profiler id="EmotionWithCX" onRender={onRender}>
                <EmotionWithCX />
              </Profiler>
              <Profiler id="EmotionWithCXBlue" onRender={onRender}>
                <EmotionWithCXBlue />
              </Profiler>
              <Profiler id="EmotionInside" onRender={onRender}>
                <EmotionInside />
              </Profiler>
              <Profiler id="EmotionInsideBlue" onRender={onRender}>
                <EmotionInsideBlue />
              </Profiler>
              <Profiler id="EmotionInsideDynamic" onRender={onRender}>
                <EmotionInsideDynamic i={key} />
              </Profiler>
              <Profiler id="Styled" onRender={onRender}>
                <Styled />
              </Profiler>
              <Profiler id="StyledBlue" onRender={onRender}>
                <StyledBlue />
              </Profiler>
              <Profiler id="StyledIntermediate" onRender={onRender}>
                <StyledIntermediate />
              </Profiler>
              <Profiler id="StyledIntermediateBlue" onRender={onRender}>
                <StyledIntermediateBlue />
              </Profiler>
              <Profiler id="StyledDynamic" onRender={onRender}>
                <StyledDynamic i={key} />
              </Profiler>
            </Fragment>
          )
      )}
      <table>
        <caption>Performance - mount</caption>
        <thead>
          <tr>
            <th>Method</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {mountList.map(([method, duration]) => (
            <tr key={method}>
              <td>
                {styledMethods.includes(method) ? (
                  <strong>💅{method}</strong>
                ) : emotionMethods.includes(method) ? (
                  <strong>👩‍🎤{method}</strong>
                ) : (
                  method
                )}
              </td>
              <td>{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <caption>Performance - update</caption>
        <thead>
          <tr>
            <th>Method</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {updateList.map(([method, duration]) => (
            <tr key={method}>
              <td>
                {styledMethods.includes(method) ? (
                  <strong>💅{method}</strong>
                ) : emotionMethods.includes(method) ? (
                  <strong>👩‍🎤{method}</strong>
                ) : (
                  method
                )}
              </td>
              <td>{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
