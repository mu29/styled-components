// @flow
import StyleSheet from '../sheet';
import type { RuleSet, Stringifier } from '../types';
import flatten from '../utils/flatten';
import isStaticRules from '../utils/isStaticRules';

export default class GlobalStyle {
  componentId: string;

  isStatic: boolean;

  rules: RuleSet;

  constructor(rules: RuleSet, componentId: string) {
    this.rules = rules;
    this.componentId = componentId;
    this.isStatic = isStaticRules(rules);

    // load before component ones
    StyleSheet.registerId(this.componentId);
  }

  createStyles(
    executionContext: Object,
    styleSheet: StyleSheet,
    stylis: Stringifier
  ) {
    const flatCSS = flatten(this.rules, executionContext, styleSheet, stylis);
    const css = stylis(flatCSS.join(''), '');
    const id = this.componentId;

    // NOTE: We use the id as a name as well, since these rules never change
    styleSheet.insertRules(id, id, css);
  }

  removeStyles(styleSheet: StyleSheet) {
    styleSheet.clearRules(this.componentId);
  }

  renderStyles(
    executionContext: Object,
    styleSheet: StyleSheet,
    stylis: Stringifier
  ) {
    // NOTE: Remove old styles, then inject the new ones
    this.removeStyles(styleSheet);
    this.createStyles(executionContext, styleSheet, stylis);
  }
}
