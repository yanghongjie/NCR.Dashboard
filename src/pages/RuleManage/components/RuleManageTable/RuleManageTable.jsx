import React, { Component } from 'react';
import axios from 'axios';
import IceContainer from '@icedesign/container';
import CustomTable from '../../../../components/CustomTable';
import TableFilter from '../TableFilter';
import DataBinder from '@icedesign/data-binder';
import { Switch, Button, Icon, Message, Dialog, Form, Field, Input, NumberPicker } from '@alifd/next';
import IceLabel from '@icedesign/label';
import moment from 'moment'
const FormItem = Form.Item;

@DataBinder({
  ruleData: {
    url: 'http://localhost:33304/RuleManage/GetRuleList',
    //url: '/RuleManage/GetRuleList',
    method: 'POST',
    data: {
      pageIndex: 0,
      pageSize: 20,
    },
    responseFormatter: (responseHandler, body, response) => {
      const newBody = {
        status: body.code === '0' ? 'SUCCESS' : 'ERROR',
        message: body.message,
        data: {
          list: body.data,
          totalCount: body.totalCount
        }
      };
      responseHandler(newBody, response);
    },
    defaultBindingData: {}
  }
})

export default class RuleManageTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      currentPageIndex: 1,
      filter: {
        ruleName: "",
        ruleType: "",
        ruleStatus: "-1",
      }
    };
    this.field = new Field(this);
  }

  componentDidMount() {
    this.handleSubmit(this.state.currentPageIndex);
  }

  handleSubmit = (current, values) => {
    console.log(current);
    this.setState({
      currentPageIndex: current,   
      filter: values,
    });
    
    this.queryData(current,values);
  };
  
  queryData=(current, values)=>{
    this.props.updateBindingData('ruleData', {
      data: {
        ...values,
        pageIndex: current,
        pageSize: 20,
      }
    });
  }

  handlePageChange = (current) => {
    this.setState({
      currentPageIndex: current,      
    });
    
    this.queryData(current,this.state.filter);
  };

  handleSubmitForEdit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        return;
      }
      const that = this;
      axios.post('http://localhost:33304/RuleManage/SaveRule', values)
        .then(function ({ data }) {
          if (data.success) {
            that.editClose();
            that.handleSubmit(that.state.currentPageIndex,that.state.filter);
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
      id:0
    });
    this.setState({
      visible: true,
    });
  };

  editOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
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
      <Button type="secondary" size="medium">查看规则项</Button>
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
        title: '规则名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '规则类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
        cell: this.renderState,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
      },
      {
        title: '描述',
        dataIndex: 'desciption',
        key: 'desciption',
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
    const { ruleData } = this.props.bindingData;
    const { list, totalCount, __loading, __error } = ruleData;
    const init = this.field.init;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const filterProps = {
      ...this.state.filter,
      handleSubmit: this.handleSubmit,
    }
    return (
      <div>
        <IceContainer>
          <div style={styles.tableHead}>
            <div style={styles.tableTitle}>规则管理</div>
          </div>
          <TableFilter {...filterProps} />
          <div style={styles.addBtnDiv}>
            <Button type="primary" style={styles.addButton} onClick={this.addOpen}><Icon type="add" />新 增</Button>
          </div>
          <CustomTable
            columns={this.columnsConfig()}
            dataSource={list}
            isLoading={__loading}
            onChange={this.handlePageChange}
            total={totalCount}
            current={this.state.currentPageIndex}
            pageSize={20}
          />
        </IceContainer>
        <Dialog
          style={styles.editDialog}
          visible={this.state.visible}
          onOk={this.handleSubmitForEdit}
          closeable="esc,mask,close"
          onCancel={this.editClose}
          onClose={this.editClose}
          title="编辑"
        >
          <Form field={this.field}>
            <FormItem label="规则名称：" {...formItemLayout}>
              <Input
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="规则类型：" {...formItemLayout}>
              <Input
                {...init('type', {
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

            <FormItem label="优先级：" {...formItemLayout}>
              <NumberPicker type="inline" step={1} min={0}
                {...init('priority', {
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
  stateText: {
    display: 'inline-block',
    padding: '5px 10px',
    color: '#52c41a',
    background: '#f6ffed',
    border: '1px solid #b7eb8f',
    borderRadius: '4px',
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
