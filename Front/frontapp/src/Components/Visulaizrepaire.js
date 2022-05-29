import React, { Component } from 'react'
import { Button, Form, Input } from 'antd';
const { TextArea } = Input;
export default class Visulaizrepaire extends Component {
    state = {
        Viewer: 'http://124.221.220.105:8088/neo4j/',
        formLayout: {
            labelCol: {
                span: 10,
            },
            wrapperCol: {
                span: 10,
            },
        },
        formLayout2: {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 12,
            },
        },
        formLayout3: {
            labelCol: {
                span: 10,
            },
            wrapperCol: {
                span: 10,
            },
        }

    }
    render() {
        const { formLayout, formLayout2, formLayout3 } = this.state
        return (
            <div>
                <div style={{ marginTop: "10px" }} >
                    <h2>运维知识图谱可视化</h2>
                    {/* <Button type="default" style={{ position: "absolute", left: "95%" }} ><a href='http://124.221.220.105:8088/neo4j/' target="Viewergraph">显示</a></Button> */}
                </div>
                <div style={{ marginTop: '40px' }}>
                    <Form>
                        <Form.Item label="节点" style={{ display: 'inline-flex', width: 'calc(45% - 4px)' }} {...formLayout}>
                            <Input placeholder="默认name" />
                        </Form.Item>
                        <Form.Item label="关系" style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }} {...formLayout2}>
                            <Input placeholder="默认name" />
                        </Form.Item>
                    </Form>
                    <Form {...formLayout3}>
                        <Form.Item label="语句" style={{ display: 'inline-flex', width: 'calc(45% - 4px)' }}>
                            <TextArea placeholder="输入一段话" />
                        </Form.Item>
                        <Form.Item style={{ display: 'inline-flex', marginLeft: '25px' }}>
                            <Button type="primary">查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <iframe style={{ height: "1000px", width: "100%", marginTop: "50px" }} name="Viewergraph" title='Viewer' ></iframe>
            </div>
        )
    }
}
