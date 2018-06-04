import React, { Component } from 'react';
import { Button } from 'antd';
import $ from 'jquery';
import style from './style.sass';

class NewVersion extends Component{
  state: {
    information: Object
  };

  constructor(): void{
    super(...arguments);

    this.state = {
      information: null
    };
  }
  componentWillReceiveProps(nextProps: Object): void{
    if(nextProps.searchAll === true){
      this.onSearchVersion();
    }
  }
  // 搜索
  // TODO: 搜索的另一个接口为https://www.npmjs.com/search/suggestions?q=
  onSearchVersion(event: Event): void{
    const _this: this = this;
    $.ajax({
      url: 'https://www.npmjs.com/search?q=' + this.props.item.name,
      type: 'GET',
      dataType: 'json',
      async: true,
      headers: {
        'x-spiferack': 1
      },
      success(data: string, status: string, xhr: XMLHttpRequest): void{
        _this.setState({
          information: data
        });
      }
    });
  }
  // 判断information
  information(): Object{
    const information: Object = this.state.information;
    // 获取version
    const pkg: ?Object = (information.objects && information.objects.length) > 0 ? information.objects[0].package : null;
    let version: string = (pkg && this.props.item.name === pkg.name) ? pkg.version : null;
    if(version === null){
      version = ('packageVersion' in information && information.package === this.props.item.name) ? information.packageVersion.version : 'No Package';
    }
    const classname: ?string = this.props.item.oldVersion.includes(version) ? null : (
      version === 'No Package' ? style.noPackage : style.hasNew
    );
    return (
      <span className={ classname } key={ 0 }>{ version }</span>
    );
  }
  render(): Array{
    return [
      this.state.information ? this.information() : null,
      <Button key={ 1 } className={ style.searchBtn } size="small" onClick={ this.onSearchVersion.bind(this) }>搜索</Button>
    ];
  }
}

export default NewVersion;