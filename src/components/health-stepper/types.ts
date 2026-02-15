import type { ComponentType } from "react";
import type { HealthFormField, StepComponentProps } from "../../types";

export interface StepDefinition {
  label: string;
  component: ComponentType<StepComponentProps>;
  fields: HealthFormField[];
}
