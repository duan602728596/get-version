import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Layout, Button, Tabs, message } from 'antd';
import $ from 'jquery';
import style from './style.sass';
import { fileList } from '../store/reducer';
import Detail from './Detail';
const path: Object = global.require('path');
const fs: Object = global.require('fs');

/* state */
const state: Function = createStructuredSelector({
  fileList: createSelector(  // 文件列表
    ($$state: Immutable.Map): Immutable.Map | Array => $$state.get('index'),
    ($$data: Immutable.List | Array): Array=>{
      const fileList: Immutable.Map | Array = $$data.get('fileList');
      return fileList instanceof Array ? fileList : fileList.toJS();
    }
  )
});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    fileList
  }, dispatch)
});

@connect(state, dispatch)
class Index extends Component{
  state: {
    tabsKey: ?string
  };

  constructor(): void{
    super(...arguments);

    this.state = {
      tabsKey: null
    };
  }
  // 搜索是否有重复
  isReset(filePath: string): number{
    let res: ?number = null;
    for(let i: number = 0, j: number = this.props.fileList.length; i < j; i++){
      const item: Object = this.props.fileList[i];
      if(filePath === item.path){
        res = i;
        break;
      }
    }
    return res;
  }
  // 导入文件
  readFile(filePath: string): Promise<string>{
    return new Promise((resolve: Function, reject: Function): void=>{
      fs.readFile(filePath, (err: Error, data: ArrayBuffer): void=>{
        if(err){
          reject(err);
        }else{
          resolve(data);
        }
      });
    });
  }
  // file change事件
  async onFileChange(event: Event): void{
    try{
      const value: ?string = event.target.value;
      if(value === '') return void 0;

      // 判断是否是package.json [base]
      const packageInfor: Object = path.parse(value);
      if(packageInfor.base !== 'package.json'){
        message.error('必须选择一个package.json！');
        return void 0;
      }

      // 查重
      const index: ?number = this.isReset(value);
      if(index !== null){
        this.setState({
          tabsKey: this.props.fileList[index].path
        });
        return void 0;
      }

      // 导入package.json
      const data: ArrayBuffer = await this.readFile(value);
      const data2: Object = JSON.parse(data.toString());

      this.setState({
        tabsKey: value
      });
      this.props.fileList.push({
        path: value,
        data: data2
      });
      this.props.action.fileList({
        data: [...this.props.fileList]
      });
      $('#inputFile').val('');
    }catch(err){
      message.error(err);
      console.error(err);
    }
  }
  // 点击inputFile
  onClickInput(event: Event): void{
    $('#inputFile').click();
  }
  // tabs切换
  onTabsChange(activeKey: string): void{
    this.setState({
      tabsKey: activeKey
    });
  }
  // 删除tabs
  onDeleteTabs(targetKey: string, action: string): void{
    if(action === 'remove'){
      const index: number = this.isReset(targetKey);
      this.props.fileList.splice(index, 1);
      this.setState({
        tabsKey: this.props.fileList.length === 0 ? null : this.props.fileList[0].path
      });
      this.props.action.fileList({
        data: [...this.props.fileList]
      });
    }
  }
  // 选项卡view
  tabsTabPaneView(): Array{
    return this.props.fileList.map((item: Object, index: number): Object=>{
      return (
        <Tabs.TabPane key={ item.path } tab={ item.path } closable={ true }>
          <Detail item={ item } />
        </Tabs.TabPane>
      );
    });
  }
  render(): Object{
    return (
      <Layout className={ style.layout }>
        <Layout.Header>
          <input className={ style.inputFile } id="inputFile" type="file" onChange={ this.onFileChange.bind(this) } />
          <Button className={ style.inputFileBtn } type="primary" onClick={ this.onClickInput.bind(this) }>选择文件</Button>
          <span className={ style.tishi }>选择一个package.json</span>
        </Layout.Header>
        <Layout.Content className={ style.content }>
          <Tabs className={ style.tabs } type="editable-card" activeKey={ this.state.tabsKey } onChange={ this.onTabsChange.bind(this) } onEdit={ this.onDeleteTabs.bind(this) }>
            { this.tabsTabPaneView() }
          </Tabs>
        </Layout.Content>
      </Layout>
    );
  }
}

export default Index;