import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styles from './Login.css';
import {connect} from "dva";

class Login extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'indexPage/logIn',
          payload: {username: values.username, password: values.password, remember: values.remember}
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <main>
        <h2 className={styles.logo}>Messaging System</h2>
      <Form onSubmit={this.handleSubmit} className={styles.login}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <br/>
          <Button type="primary" htmlType="submit" className={styles.loginButton}>
            Log in
          </Button>
        </Form.Item>
      </Form>
  </main>
    );
  }
}

export default Form.create()(connect(({indexPage}) => ({indexPage}))(Login));
