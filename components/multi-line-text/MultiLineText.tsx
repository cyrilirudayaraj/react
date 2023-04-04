import React from 'react';
export interface MultiLineTextProps {
  value: string;
}
const MultiLineText = (props: MultiLineTextProps): JSX.Element => {
  const path = process.env.REACT_APP_BASE_CONTEXT_PATH + 'tasks/';
  return (
    <React.Fragment>
      {props.value.split('\n').map((value: string, index: number) => {
        return (
          <span key={index}>
            {value.split(' ').map((val: string, ind: number) => {
              return val.startsWith('T-') ? (
                <a target="_blank" rel="noreferrer" href={path + val.slice(2)}>
                  {val + ' '}
                </a>
              ) : (
                val + ' '
              );
            })}
            <br />
          </span>
        );
      })}
    </React.Fragment>
  );
};
export default MultiLineText;
