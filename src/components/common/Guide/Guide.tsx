import React, { CSSProperties } from 'react';
let guideKey = 0;

export interface GuideProperties extends React.HTMLAttributes<HTMLElement> {
    guideAmount: number,
    guideStyle?: CSSProperties
}

function GuideInternal(props: GuideProperties) {
    const { guideAmount, guideStyle, ...rest } = props;
    const guides = [...Array(guideAmount)].map(() => { return (<div key={guideKey++} style={guideStyle} />) });
    return <div {...rest}>{guides}</div>;
}

const defaultProps: GuideProperties = {
    guideAmount: 5
}

GuideInternal.defaultProps = defaultProps;

const Guide = React.memo(GuideInternal);

export default Guide;