import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle } from 'react-native-svg';
import { COLORS } from '../../constants';

export interface Attribute {
  label: string;
  value: number;
  maxValue?: number;
}

interface AttributeRadarProps {
  attributes: Attribute[];
  size?: number;
  labelColor?: string;
  valueColor?: string;
  fillColor?: string;
  strokeColor?: string;
  gridColor?: string;
}

const AttributeRadar: React.FC<AttributeRadarProps> = ({
  attributes,
  size = 300,
  labelColor = COLORS.textOnPrimary,
  valueColor = COLORS.text,
  fillColor = 'rgba(255, 152, 0, 0.3)',
  strokeColor = COLORS.warning,
  gridColor = COLORS.border,
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35; // Radius for the hexagon
  const labelOffset = size * 0.42; // Distance for labels from center (closer to chart)

  // Calculate positions for attributes around a hexagon
  const getPosition = (index: number, distance: number) => {
    // Start from top and go clockwise
    // Offset by -90 degrees to start from top
    const angle = (index * (2 * Math.PI)) / attributes.length - Math.PI / 2;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    return { x, y, angle };
  };

  // Create polygon points for the filled area (based on attribute values)
  const getPolygonPoints = () => {
    return attributes
      .map((attr, index) => {
        const maxValue = attr.maxValue || 100;
        const percentage = attr.value / maxValue;
        const distance = radius * percentage;
        const pos = getPosition(index, distance);
        return `${pos.x},${pos.y}`;
      })
      .join(' ');
  };

  // Create polygon points for the outer grid (max values)
  const getGridPolygonPoints = () => {
    return attributes
      .map((_, index) => {
        const pos = getPosition(index, radius);
        return `${pos.x},${pos.y}`;
      })
      .join(' ');
  };

  // Create grid lines (for reference levels like 25%, 50%, 75%, 100%)
  const renderGridLevels = () => {
    const levels = [0.25, 0.5, 0.75, 1.0];
    return levels.map((level, levelIndex) => {
      const points = attributes
        .map((_, index) => {
          const pos = getPosition(index, radius * level);
          return `${pos.x},${pos.y}`;
        })
        .join(' ');

      return (
        <Polygon
          key={`grid-${levelIndex}`}
          points={points}
          fill="none"
          stroke={gridColor}
          strokeWidth="1"
          opacity={0.3}
        />
      );
    });
  };

  // Render axis lines from center to each vertex
  const renderAxisLines = () => {
    return attributes.map((_, index) => {
      const pos = getPosition(index, radius);
      return (
        <Line
          key={`axis-${index}`}
          x1={centerX}
          y1={centerY}
          x2={pos.x}
          y2={pos.y}
          stroke={gridColor}
          strokeWidth="1"
          opacity={0.3}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.svgContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Grid levels */}
          {renderGridLevels()}

          {/* Axis lines */}
          {renderAxisLines()}

          {/* Filled polygon (player's attributes) */}
          <Polygon
            points={getPolygonPoints()}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
          />

          {/* Dots at each data point */}
          {attributes.map((attr, index) => {
            const maxValue = attr.maxValue || 100;
            const percentage = attr.value / maxValue;
            const distance = radius * percentage;
            const pos = getPosition(index, distance);
            return (
              <Circle
                key={`dot-${index}`}
                cx={pos.x}
                cy={pos.y}
                r="4"
                fill={strokeColor}
              />
            );
          })}
        </Svg>

        {/* Attribute labels positioned around the hexagon */}
        {attributes.map((attr, index) => {
          const pos = getPosition(index, labelOffset);

          return (
            <View
              key={`label-${index}`}
              style={[
                styles.attributeLabel,
                {
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  transform: [
                    { translateX: -27 }, // Half of minWidth (54/2) to center horizontally
                    { translateY: -22 }, // Approximate half height to center vertically
                  ],
                },
              ]}
            >
              <View style={[styles.attributeBadge, { backgroundColor: strokeColor }]}>
                <Text style={[styles.attributeLabelText, { color: labelColor }]}>
                  {attr.label}
                </Text>
              </View>
              <Text style={[styles.attributeValue, { color: valueColor }]}>
                {attr.value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'relative',
  },
  attributeLabel: {
    alignItems: 'center',
    gap: 4,
  },
  attributeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 54,
    alignItems: 'center',
  },
  attributeLabelText: {
    fontSize: 11,
    fontFamily: 'FranklinGothic-Demi',
  },
  attributeValue: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
  },
});

export default AttributeRadar;
