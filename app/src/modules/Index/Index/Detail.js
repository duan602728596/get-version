import React, { Component } from 'react';
import { Button } from 'antd';
import style from './style.sass';
import NewVersion from './NerVersion';

class Detail extends Component{
  state: {
    searchAll: boolean
  };

  constructor(): void{
    super(...arguments);

    this.state = {
      searchAll: false  // 搜索全部
    };
  }
  // Object to Array
  object2Array(obj: Object): Array<{ name: string, oldVersion: string }>{
    const arr: Array = [];
    for(const key: string in obj){
      arr.push({
        name: key,
        oldVersion: obj[key]
      });
    }
    return arr;
  }
  // 渲染td
  tdView(arr: Array): Array{
    return arr.map((item: Object, index: number): Object=>{
      return (
        <tr key={ item.name }>
          <td>{ item.name }</td>
          <td>{ item.oldVersion }</td>
          <td className="clearfix">
            <NewVersion item={ item } searchAll={ this.state.searchAll } />
          </td>
        </tr>
      );
    });
  }
  // 搜索全部
  onSearchAll(event: Event): void{
    this.setState({
      searchAll: true
    });
  }
  render(): Object{
    const item: Object = this.props.item;
    const dependencies: Array = 'dependencies' in item.data ? this.object2Array(item.data.dependencies) : [];
    const devDependencies: Array = 'devDependencies' in item.data ? this.object2Array(item.data.devDependencies) : [];

    return (
      <div className={ style.detail }>
        <p className={ style.detailInfor }>
          <span className={ style.detailSpan }>
            <b>name：</b>
            { item.data.name }
          </span>
          <span className={ style.detailSpan }>
            <b>文件地址：</b>
            { item.path }
          </span>
          <Button className={ style.searchAll } type="primary" onClick={ this.onSearchAll.bind(this) }>查找全部</Button>
        </p>
        <h4 className={ style.title }>dependencies：</h4>
        <table className={ style.table }>
          <thead>
            <tr>
              <th>name</th>
              <th>old version</th>
              <th>new version</th>
            </tr>
          </thead>
          <tbody>{ this.tdView(dependencies) }</tbody>
        </table>
        <h4 className={ style.title }>devDependencies：</h4>
        <table className={ style.table }>
          <thead>
            <tr>
              <th>name</th>
              <th>old version</th>
              <th>new version</th>
            </tr>
          </thead>
          <tbody>{ this.tdView(devDependencies) }</tbody>
        </table>
      </div>
    );
  }
}

export default Detail;