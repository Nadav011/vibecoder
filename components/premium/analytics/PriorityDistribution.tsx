import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";
import { LegendItem } from "./LegendItem";
import type { PriorityDistribution as PriorityDistributionType } from "./types";

interface PriorityDistributionProps {
  priorityDistribution: PriorityDistributionType;
  totalPriorityTasks: number;
}

export function PriorityDistribution({
  priorityDistribution,
  totalPriorityTasks,
}: PriorityDistributionProps) {
  return (
    <FadeIn delay={200} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>התפלגות לפי עדיפות</Text>
        <View style={styles.distributionCard}>
          <View style={styles.distributionBar}>
            {totalPriorityTasks > 0 ? (
              <>
                <View
                  style={[
                    styles.distributionSegment,
                    {
                      flex: priorityDistribution.p0,
                      backgroundColor: colors.status.p0,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.distributionSegment,
                    {
                      flex: priorityDistribution.p1,
                      backgroundColor: colors.status.p1,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.distributionSegment,
                    {
                      flex: priorityDistribution.p2,
                      backgroundColor: colors.status.p2,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.distributionSegment,
                    {
                      flex: priorityDistribution.p3,
                      backgroundColor: colors.status.p3,
                    },
                  ]}
                />
              </>
            ) : (
              <View
                style={[
                  styles.distributionSegment,
                  { flex: 1, backgroundColor: colors.bg.tertiary },
                ]}
              />
            )}
          </View>

          <View style={styles.distributionLegend}>
            <LegendItem
              color={colors.status.p0}
              label="קריטי"
              value={priorityDistribution.p0}
            />
            <LegendItem
              color={colors.status.p1}
              label="גבוה"
              value={priorityDistribution.p1}
            />
            <LegendItem
              color={colors.status.p2}
              label="בינוני"
              value={priorityDistribution.p2}
            />
            <LegendItem
              color={colors.status.p3}
              label="נמוך"
              value={priorityDistribution.p3}
            />
          </View>
        </View>
      </View>
    </FadeIn>
  );
}
