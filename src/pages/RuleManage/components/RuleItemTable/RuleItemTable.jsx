/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Dialog, Form,Field, Input,Switch,Icon,Message} from '@alifd/next';
import IceLabel from '@icedesign/label';
import IceContainer from '@icedesign/container';
import moment from 'moment'
import CustomTable from '../../../../components/CustomTable';
import DataBinder from '@icedesign/data-binder';
import axios from 'axios';
const FormItem = Form.Item;

@DataBinder({
  ruleItemData: {
    // url: 'http://localhost:33304/RuleManage/GetRuleById',
    url: '/RuleManage/GetRuleById',
    method: 'POST',
    data: {
      ruleId: 0
    },
    responseFormatter: (responseHandler, body, response) => {
      const newBody = {
        status: body.code === '0' ? 'SUCCESS' : 'ERROR',
        message: body.message,
        data: {
          ruleName:body.data.name,
          ruleType: body.data.type,
          ruleStatus: body.data.enabled,
          ruleDes: body.data.desciption,
          list: body.data.ruleItems,
        }
      };
      responseHandler(newBody, response);
    },
    defaultBindingData: {}
  }
})

export default class RuleItemTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ruleId:0,
      visible: false,
    };
    this.field = new Field(this);
  }
  
  componentDidMount() {
    this.queryData();
  }

  queryData(){
    this.setState({
      ruleId:this.props.match.params.ruleid
    });
    this.props.updateBindingData('ruleItemData', {
      data: {
        ruleId:this.props.match.params.ruleid
      }
    });

  }
  
  handleSubmitForEdit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        return;
      }
      const that = this;
      // axios.post('http://localhost:33304/RuleManage/SaveRuleItem', values)
      axios.post('/RuleManage/SaveRuleItem', values)
        .then(function ({ data }) {
          if (data.success) {
            that.editClose();
            that.queryData();
          }
          else {
            Message.error(data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
          Message.error('网络问题，请稍后重试！');
        });

    });
  };

  addOpen = () => {
    this.field.setValues({
      id:0,
      ruleId:this.state.ruleId,
    });
    this.setState({
      visible: true,
    });
  };

  editOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true
    });
  };

  editClose = () => {
    this.setState({
      visible: false,
    });
  };

  renderOper = (value, index, record) => {
    return (
      <div>
        <Button type="primary" size="medium" onClick={() => this.editOpen(index, record)}>编辑</Button>&nbsp;&nbsp;
      </div>
    );
  };

  renderState = (value) => {
    return (
      value ? <IceLabel status="success">启用</IceLabel> : <IceLabel status="default">禁用</IceLabel>
    );
  };

  renderTime = (value) => {
    return (
      moment(value).format('YYYY-MM-DD HH:mm:ss')
    );
  };

  columnsConfig = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '规则项类型',
        dataIndex: 'ruleItemType',
        key: 'ruleItemType',
      },
      {
        title: '运算类型',
        dataIndex: 'computeType',
        key: 'computeType',
      },
      {
        title: '规则值',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '描述',
        dataIndex: 'desciption',
        key: 'desciption',
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
        cell: this.renderState,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        cell: this.renderTime,
      },
      {
        title: '更改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        cell: this.renderTime,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        cell: this.renderOper,
      }
    ];
  };

  render() {
    const { ruleItemData } = this.props.bindingData;
    const { list, ruleName,ruleType,ruleStatus,ruleDes, __loading } = ruleItemData;
    const init = this.field.init;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div className="tag-table">
        <IceContainer>
          <div style={styles.tableHead}>
            <div style={styles.tableTitle}>规则项</div>
          </div>
          <div style={styles.formContent}>
            <div style={styles.filterItem}>
              <span style={styles.filterLabel}>规则名称 ： </span>
              <span style={styles.filterValue}>{ruleName}</span>
            </div>
            <div style={styles.filterItem}>
              <span style={styles.filterLabel}>规则类型 ： </span>
              <span style={styles.filterValue}>{ruleType}</span>
            </div>
            <div style={styles.filterItem}>
              <span style={styles.filterLabel}>规则状态 ： </span>
              <span>{ruleStatus?<IceLabel status="success">启用</IceLabel> : <IceLabel status="default">禁用</IceLabel>}</span>
            </div>
            <div style={styles.filterItem}>
              <span style={styles.filterLabel}>规则描述 ： </span>
              <span style={styles.filterValue}>{ruleDes}</span>
            </div>
          </div>
          <div style={styles.addBtnDiv}>
            <Button type="primary" style={styles.addButton} onClick={this.addOpen}><Icon type="add" />新 增</Button>
          </div>
          <CustomTable
            columns={this.columnsConfig()}
            dataSource={list}
            isLoading={__loading}
            total={100}
            current={1}
            pageSize={100}
          />
        </IceContainer>
        <Dialog
          style={styles.editDialog}
          visible={this.state.visible}
          onOk={this.handleSubmitForEdit}
          closeable="esc,mask,close"
          onCancel={this.editClose}
          onClose={this.editClose}
          title="规则项"
        >
          <Form field={this.field}>
            <FormItem label="规则项类型：" {...formItemLayout}>
              <Input
                {...init('ruleItemType', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="运算类型：" {...formItemLayout}>
              <Input
                {...init('computeType', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="规则值：" {...formItemLayout}>
              <Input
                {...init('value', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="描述：" {...formItemLayout}>
              <Input
                {...init('desciption', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="是否启用" {...formItemLayout}>
              <Switch {...init('enabled', { valueName: 'checked' })} />
            </FormItem>
          </Form>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  tableHead: {
    height: '32px',
    lineHeight: '32px',
    margin: '0 0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    height: '20px',
    lineHeight: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    paddingLeft: '12px',
    borderLeft: '4px solid #666',
  },
  formContent: {
    width: '100%',
    position: 'relative',
    background: '#f4f4f4',
    padding: '15px 0',
    marginBottom: '20px',
  },
  filterItem: {
    alignItems: 'center',
    marginLeft: '15px',
    padding: '5px 0',
    with: '50px',
  },
  filterLabel: {
    // fontWeight: 'bold'
  },
  filterValue: {
    color: 'gray',
  },
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
    width: '600px'
  },
  addBtnDiv: {
    display: 'flex',
    marginBottom: '20px',
  },
  addButton: {
    background: '#2eca9c',
  },
};
