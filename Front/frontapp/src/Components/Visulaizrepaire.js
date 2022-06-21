import React, { Component } from 'react'
import { Button, Form, Input, Card } from 'antd';
import * as d3 from "d3";
import axios from 'axios';
var name
var limit = 1;
var jump = 1;
const { TextArea } = Input;
export default class Visulaizrepaire extends Component {
    state = {
        nodeData: {
            nodes: [],
            links: []
        },
        multiData: {
            nodes: [],
            links: []
        },
        NLPQuery: {
            nodes: [],
            links: []
        },
        formLayout: {
            labelCol: { span: 10 },
            wrapperCol: { span: 10, },
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

    // 获得数据
    addData2 = async (e) => {
        // console.log(e)
        // 对收集到的数据进行处理
        if (e.target.className === 'ant-input deep') {
            jump = e.target.value
        }
        if (e.target.className === 'ant-input name') {
            name = e.target.value
        }
        if (e.target.className === 'ant-input amount') {
            limit = e.target.value
        }
        // 发送请求，获得节点信息
        const nodes = {
            method: 'GET',
            url: `http://124.221.220.105:8081/graph/getNodes?name=${name}&limit=${limit}`
        }
        await axios(nodes).then(
            response => {

                const data = response.data.data
                console.log(data)
                data.links = []
                data.width = 1000
                data.height = 1000
                data.colorList = ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52']
                return this.setState({
                    nodeData: data
                })
            }
        )

        // 发送多跳查询，获得节点信息
        const getMultiJumpQuery = {
            method: 'GET',
            url: `http://124.221.220.105:8081/graph/getMultiJumpQuery?name=${name}&jump=${jump}`
        }
        await axios(getMultiJumpQuery).then(
            response => {
                // console.log(response.data)
                const data = {}
                data.nodes = response.data.data[0].nodes
                data.links = response.data.data[1].links
                data.width = 1000
                data.height = 1000
                data.colorList = ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52']
                console.log(data)
                return this.setState({
                    multiData: data
                })
            }
        )

    }

    ConstractGraph = async () => {
        // 绘制图谱前删除其余图谱
        const removechild = document.getElementsByClassName('svgs')
        if (removechild !== null) {
            let amounts = removechild.length
            const parentnodes = document.getElementsByClassName('container')
            for (var i = 0; i < amounts; i++) {
                parentnodes[0].removeChild(removechild[0])
            }
        }
        // 绘制图谱
        this.Initgraph(this.state.nodeData)
    }

    multiConstractGraph = async () => {

        // 绘制图谱前删除其余图谱
        const removechild = document.getElementsByClassName('svgs')
        if (removechild !== null) {
            let amounts = removechild.length
            const parentnodes = document.getElementsByClassName('container')
            for (var i = 0; i < amounts; i++) {
                parentnodes[0].removeChild(removechild[0])
            }
        }
        // 绘制多跳图谱
        this.Initgraph(this.state.multiData)
    }
    sentceConstractGraph = async () => {

        // 绘制图谱前删除其余图谱
        const removechild = document.getElementsByClassName('svgs')
        if (removechild !== null) {
            let amounts = removechild.length
            const parentnodes = document.getElementsByClassName('container')
            for (var i = 0; i < amounts; i++) {
                parentnodes[0].removeChild(removechild[0])
            }
        }
        // 绘制图谱
        this.Initgraph(this.state.NLPQuery)
    }

    // 获取文本数据
    addData1 = async (e) => {
        console.log(e.target.value)
        // 句子查询
        const NLPQuery = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            data: e.target.value,
            url: ' http://124.221.220.105:8081/graph/getNLPQuery'
        }
        await axios(NLPQuery).then(
            response => {
                // console.log(response.data)
                const sentenceData = response.data
                console.log(sentenceData)
                return this.setState({
                    NLPQuery: sentenceData
                })
            }
        )
    }

    render() {
        const { formLayout, formLayout2, formLayout3 } = this.state
        return (
            <div>
                <div style={{ marginTop: "10px" }} >
                    <h2 style={{ display: 'inline' }}>运维知识图谱可视化</h2>
                    <a href='http://124.221.220.105:9898/' target='blank' style={{ position: 'absolute', left: '80%', fontSize: '20px' }}>多模态知识图谱构建系统</a>
                </div>
                <hr />
                <div style={{ marginTop: '40px' }}>
                    <Form onChange={this.addData2}>
                        <Form.Item label="节点" style={{ display: 'inline-flex', width: 'calc(35% - 4px)' }} {...formLayout}>
                            <Input placeholder="默认name" className='name' />
                        </Form.Item>
                        <Form.Item label="节点数量" style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }} {...formLayout2}>
                            <Input placeholder="数量不要太大" className='amount' />
                        </Form.Item>
                        <Form.Item style={{ display: 'inline-flex', marginRight: '25px' }} >
                            <Button type="primary" onClick={this.sentceConstractGraph}>查询</Button>
                        </Form.Item>
                    </Form>
                    <Form onChange={this.addData2}>
                        <Form.Item label="指定节点" style={{ display: 'inline-flex', width: 'calc(35% - 4px)' }} {...formLayout}>
                            <Input placeholder="默认name" className='name' />
                        </Form.Item>
                        <Form.Item label="深度" style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }} {...formLayout2}>
                            <Input placeholder="数量不要太大" className='deep' />
                        </Form.Item>
                        <Form.Item style={{ display: 'inline-flex', marginRight: '25px' }} >
                            <Button type="primary" onClick={this.multiConstractGraph}>多跳查询</Button>
                        </Form.Item>
                    </Form>
                    <Form >
                        <Form.Item label="自然语句" style={{ display: 'inline-flex', width: 'calc(35% - 4px)' }} {...formLayout3}>
                            <TextArea placeholder="输入一段话" onChange={this.addData1} />
                        </Form.Item>
                        {/* <Form.Item style={{ display: 'inline-flex', marginRight: '25px' }}>
                            <Button type="primary">执行</Button>
                        </Form.Item> */}
                    </Form>
                    <Button type="primary" style={{ position: 'absolute', right: '40px' }} onClick={this.ConstractGraph}>执行</Button>
                </div>
                <div style={{ marginTop: "50px" }}>
                    <h2 className="知识图谱" style={{ fontWeight: "bold" }}>
                        知识图谱结果
                    </h2>
                    <Card className='container' ></Card>
                </div>
            </div>
        )
    }
}

Visulaizrepaire.prototype.Initgraph = (data) => {
    const nodes = data.nodes;
    // 获得边的数据
    const links = data.links;

    // 动态仿真,设置动态效果
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => {
            return d.id
        }
        ).distance(250))
        // 设置节点的碰撞半径，就是两个节点的中心距离
        .force("collide", d3.forceCollide().radius(() => 50))
        // 将所有的节点都推向图表的中心（给定的一个点），默认坐标是[0,0]，施加力时，所有节点的相对位置保持不变
        .force("center", d3.forceCenter(data.width / 2, data.height / 2))
        .force("charge", d3.forceManyBody().strength(-10))

    // 构建画布svg
    const svg = d3.select(".container")
        // 添加svg画布
        .append('svg')
        .attr('class', 'svgs')
        // 给画布添加颜色
        .attr("fill", "red")
        .attr("viewBox", [0, 0, data.width, data.height])
        // 完成缩放
        .call(d3.zoom().on("zoom", function (event) {
            // console.log(event)
            g.attr("transform", event.transform)
        }))

    // 在svg画布下构建g标签元素，用来容纳links和nodes
    const g = svg.append('g')
        // g标签的clss属性为content
        .attr("class", "content")

    const positiveMarker = svg.append("marker")
        .attr("id", "positiveMarker")
        .attr("orient", "auto")
        .attr("stroke-width", 2)
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        // 设置沿着路径的移动
        .attr("refX", 35)
        .attr("refY", 0)
        // 设置箭头的大小
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        // 创建path标签，用于将箭头绘制出来
        .append("path")
        // 设置箭头四个点的坐标的位置
        .attr("d", "M 0 -5 L 10 0 L 0 5 ")
        // 填充箭头的颜色
        .attr('fill', '#999')
        // 透明度
        .attr("stroke-opacity", 0.6);

    const negativeMarker = svg.append("marker")
        .attr("id", "negativeMarker")
        .attr("orient", "auto")
        .attr("stroke-width", 2)
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", -25)
        .attr("refY", 0)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 10 -5 L 0 0 L 10 5")
        .attr('fill', '#999')
        .attr("stroke-opacity", 0.6);

    // 设置边
    const link = g.append("g")
        // 选择path标签
        .selectAll("path")
        // 绑定数据
        .data(links, function (d) {
            // console.log(typeof d.source)
            if (typeof (d.source) === 'object') {
                return d.source.name + "_" + d.label + "_" + d.target.name
            }
            else {
                return d.source + "_" + d.label + "_" + d.target
            }
        })
        // 创建path标签
        .join("path")
        // 设置箭头属性
        .attr("marker-end", "url(#positiveMarker)")
        // 线的宽度
        .attr("stroke-width", d => Math.sqrt(d.value))
        // 线的颜色
        .attr("stroke", "skyblue")
        // clss名称
        .attr("class", "link")
        // 设置id，与后面的linksname相关联
        .attr("id", function (d) {
            // console.log(d)
            if (typeof (d.source) === 'object') {
                return d.source.name + "_" + d.label + "_" + d.target.name
            }
            else {
                return d.source + "_" + d.label + "_" + d.target
            }
        })

    // 设置边的名字
    const linksName = g.append('g')
        .selectAll("text")
        .data(links, function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.name + "_" + d.label + "_" + d.target.name
            }
            else {
                return d.source + "_" + d.relation + "_" + d.target
            }
        })
        // g标签下面接text标签
        .join("text")
        // 用于文本的内容会上限浮动的问题
        .style('text-anchor', 'middle')
        // 设置颜色
        .style('fill', 'white')
        // 设置字体大小
        .style('font-size', '15px')
        // 设置字体的粗细
        .style('font-weight', 'middle');

    linksName
        // text标签下面接上textpath标签
        .append('textPath')
        // 连接到link标签，以href作为连接，id为： d.source.id + "_" + d.relation + "_" + d.target.id
        .attr('href', d => "#" + d.source.name + "_" + d.label + "_" + d.target.name)
        .attr('startOffset', '50%')
        // 文本内容
        .text(d => {
            return d.label
        });
    // console.log(link._groups[0][0])

    // 构建图的节点,每一个节点是园
    const node = g.append('g')
        .selectAll('circle')
        // 添加数据
        .data(nodes, d => d.name)
        // 添加circle元素标签
        .join("circle")
        .attr("r", 30)
        .attr("class", "node")
        .attr("fill", color)
        // 将节点的初始位置进行设置
        // .attr('transform', `translate(${500}, ${250})`)
        //给节点添加动态拖拽效果。
        .call(drag(simulation))

    node.append("title")
        .text(d => d.name);

    // 设置节点文本的信息
    const nodesName = g.append('g')
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(d => d.name)
        .attr("dx", function () {
            // 获得节点字的长度
            console.log(this.getBoundingClientRect().width)
            return this.getBoundingClientRect().width / 2 * (-1)
        })
        .attr("dy", 0)
        .attr("fill", "black")
        .attr("class", "nodeName")

    simulation.on("tick", () => {
        // 设置边
        link
            // 设置边的
            .attr("d", function (d) {
                if (d.source.x < d.target.x) {
                    return "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y
                }
                else {
                    return "M " + d.target.x + " " + d.target.y + " L " + d.source.x + " " + d.source.y
                }
            })
            // 设置箭头
            .attr("marker-end", function (d) {
                if (d.source.x < d.target.x) {
                    return "url(#positiveMarker)"
                }
                else {
                    return null
                }
            })
            .attr("marker-start", function (d) {
                if (d.source.x < d.target.x) {
                    return null
                }
                else {
                    return "url(#negativeMarker)"
                }
            })
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        nodesName
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    })

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    function color(d) {
        return data.colorList[d.group]
    }
}
