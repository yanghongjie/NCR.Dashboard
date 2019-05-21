/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Button, Select, Input, Message } from '@alifd/next';
import { FormBinderWrapper, FormBinder } from '@icedesign/form-binder';

export default class TableFilter extends Component {

  constructor(props) {
    super(props);
    const {
      handleSubmit, ...other
    } = this.props;
    this.state = other;
  }
 

  handleSubmit = () => {
    const { validateFields } = this.refs.form;
    validateFields((errors, values) => {
      if (errors) {
        Message.error('查询参数错误');
        return;
      }

      this.props.handleSubmit(1,values);
    });
  };

  render() {

    return (
      <FormBinderWrapper value={this.state} ref="form">
        <div style={styles.tableFilter}>
          <div style={styles.filterItem}>
            <span style={styles.filterLabel}>规则名称：</span>
            <FormBinder name="ruleName">
              <Input placeholder="请输入规则名称" />
            </FormBinder>
          </div>

          <div style={styles.filterItem}>
            <span style={styles.filterLabel}>规则类型：</span>
            <FormBinder name="ruleType">
              <Input placeholder="请输入规则类型" />
            </FormBinder>
          </div>

          <div style={styles.filterItem}>
            <span style={styles.filterLabel}>状态：</span>
            <FormBinder name="ruleStatus">
              <Select>
                <Select.Option value="-1">全部</Select.Option>
                <Select.Option value="1">启用</Select.Option>
                <Select.Option value="0">禁用</Select.Option>
              </Select>
            </FormBinder>
          </div>
          <Button
            type="primary"
            style={styles.submitButton}
            onClick={this.handleSubmit}
          >
            查询
          </Button>
        </div>
      </FormBinderWrapper>
    );
  }
}

const styles = {
  tableFilter: {
    display: 'flex',
    background: '#f4f4f4',
    padding: '15px 0',
    marginBottom: '20px',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '15px',
  },
  submitButton: {
    marginLeft: '15px',
  },
};
