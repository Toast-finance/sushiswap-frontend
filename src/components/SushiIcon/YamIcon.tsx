import React from 'react'

interface YamIconProps {
  size?: number,
  v1?: boolean,
  v2?: boolean,
  v3?: boolean,
  icon?: String,
}

const YamIcon: React.FC<YamIconProps> = ({ size = 36, v1, v2, v3, icon = "🍞" }) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? 'saturate(0.5)' : undefined
    }}
  >
      {icon}
  </span>
)

export default YamIcon