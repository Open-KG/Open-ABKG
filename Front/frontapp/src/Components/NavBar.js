import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Knowledgeextract from './Knowledgeextract';
import Visulaizrepaire from './Visulaizrepaire';
import { MailOutlined, } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,

} from '@ant-design/icons';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'Introduction',
        };
    }
    toggleCollapsed = () => {
        this.setState({ collapsed: !this.state.collapsed, });
    };
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    };

    render() {
        return (
            <div>
                <div style={{ width: "15 %", position: "fixed" }}>
                    <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}</Button>
                    <Menu mode="inline" theme="dark" inlineCollapsed={this.state.collapsed} style={{ height: "1000px" }} >
                        <Menu.Item key="CompanySearch" icon={<MailOutlined />}><Link className="list-group-item" to="/Knowledgeextract">知识抽取</Link></Menu.Item>
                        <Menu.Item key="repairevisialby" icon={<MailOutlined />}><Link className="list-group-item" to="/Visulaizrepaire">运维知识图谱可视化</Link></Menu.Item>
                    </Menu>
                </div>
                <div style={{ position: "absolute", top: "5%", left: "15%", width: "83%" }}>
                    <Routes>
                        <Route path='/Knowledgeextract' element={<Knowledgeextract />} />
                        <Route path='/visulaizrepaire' element={<Visulaizrepaire />} />
                    </Routes>
                </div>
            </div>
        )
    }
}

export default NavBar;