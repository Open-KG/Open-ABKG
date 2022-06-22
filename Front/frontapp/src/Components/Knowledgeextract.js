import React, { Component } from 'react'
import { Button, Input, Card } from 'antd';
import ReactDOM from 'react-dom/client';
import * as d3 from "d3";
import axios from 'axios';
import './KG.css'
const { TextArea } = Input;
const controller = new AbortController();
let isSending = false
export default class Knowledgeextract extends Component {
    state = {
        InputText: "",
        Kgner: [],
        KeyWord: [],
        data: {
            nodes: [],
            links: [],
            width: 1000,
            height: 1000,
            colorList: ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52'],
        }
    }

    // 获得输入框中的数据并且获得图谱数据
    addData = async (e) => {
        await this.setState({ InputText: e.target.value })
    }

    ConstractGraph = async () => {

        if (isSending) controller.abort();
        // 获得图谱数据
        const graphdatas = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            data: this.state.InputText,
            url: '  http://124.221.220.105:8081/nlp/graph'
        }
        await axios(graphdatas).then(
            response => {
                const graphdata = {}
                graphdata.nodes = response.data.data.nodes
                graphdata.links = response.data.data.links
                graphdata.width = 1000
                graphdata.height = 1000
                graphdata.colorList = ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52']
                console.log(graphdata)
                return this.Initgraph(graphdata)
                // 逻辑存在问题
                // return document.getElementById('svgs') === null ? this.Initgraph(graphdata) : 1

            }
        )
    }

    // 命名实体识别
    Recentity = async () => {
        // 发送请求命名实体识别
        const entity = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            data: this.state.InputText,
            url: ' http://124.221.220.105:8081/nlp/entity'
        }
        await axios(entity).then(
            response => {
                // console.log(response.data)
                const Kgners = response.data.data
                console.log(Kgners)
                const arr = []
                let str
                for (let i = 0; i < Kgners.length; i++) {
                    str = `{("产品": ${Kgners[i].entity}),          ("类别": ${Kgners[i].type})}\n `
                    arr[i] = str
                    console.log(typeof (str))
                }
                console.log(arr)
                return this.setState({
                    Kgner: arr
                })
            }
        )

    }

    // 关系抽取
    GetRelation = async () => {
        // 发送请求关系抽取
        const relation = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            data: this.state.InputText,
            url: ' http://124.221.220.105:8081/nlp/relation'
        }
        await axios(relation).then(
            response => {
                const KeyWord = response.data.data[0]
                console.log(KeyWord)
                const arr = []
                let str
                for (let i = 0; i < KeyWord.length; i++) {
                    str = `{("头实体": ${KeyWord[i].head}), ("关系":${KeyWord[i].relation}),("尾实体": ${KeyWord[i].tail})}\n `
                    arr[i] = str
                    // console.log(typeof (str))
                }
                // console.log(arr)
                return this.setState({
                    KeyWord: arr
                })
            }
        )
    }

    // 清除数据
    RemoteData = async () => {
        console.log(this)
        this.setState({
            InputText: '',
            Kgner: [],
            KeyWord: [],
            data: {
                "nodes": [],
                "links": [],
                width: 1000,
                height: 1000,
                colorList: ['#FD7623', '#3388B1', '#D82952', '#F3D737', '#409071', '#D64E52'],
            }
        })

        const removechild = document.getElementsByClassName('svgs')
        console.log(removechild)
        console.log(removechild.length)
        let amounts = removechild.length
        const parentnodes = document.getElementsByClassName('container')
        for (var i = 0; i < amounts; i++) {
            parentnodes[0].removeChild(removechild[0])
            console.log(1)
        }


    }

    render() {
        return (
            <div>
                <div style={{ marginTop: "10px" }} ><h2>知识抽取</h2></div>
                <hr />
                <div style={{ marginTop: "50px" }}>
                    <h2 style={{ fontWeight: "bold" }}>知识抽取</h2>
                    <div style={{ display: "inline-block", width: "50%", marginTop: "10px" }}>
                        <h3 >
                            <span style={{ fontWeight: "bold" }} > 输入</span>
                            <Button type="primary" shape="round" style={{ left: "80%" }} onClick={this.RemoteData}> 清空</Button>
                        </h3>
                        <TextArea rows={4} onChange={this.addData} value={this.state.InputText} placeholder={"阿莱德目前的零部件产品主要可分为三大类，分别为射频与透波防护器件、EMI及IP防护器件和电子导热散热器件。"} />
                    </div>
                    <div style={{ display: "inline-block", width: "50%" }}>
                        <h3>
                            <span style={{ fontWeight: "bold" }}> 实体识别结果</span>
                            <Button type="primary" shape="round" style={{ left: "75%" }} onClick={this.Recentity} >识别</Button>
                        </h3>
                        <TextArea rows={4} value={this.state.Kgner} ></TextArea>
                    </div>
                </div>
                <div style={{ marginTop: "50px" }}>
                    <h2 style={{ fontWeight: "bold" }}>
                        关系抽取
                        <Button type="primary" shape="round" style={{ left: "88%" }} onClick={this.GetRelation}>抽取</Button>
                    </h2>
                    <TextArea rows={4} value={this.state.KeyWord} />
                </div>
                <div style={{ marginTop: "50px" }}>
                    <h2 className="知识图谱" style={{ fontWeight: "bold" }}>
                        知识图谱结果
                        <Button type="primary" shape="round" style={{ left: "70%" }} onClick={this.ConstractGraph}>构建</Button>
                    </h2>
                    <Card className='container' ></Card>
                </div>

            </div>
        )
    }
}

Knowledgeextract.prototype.Initgraph = (data) => {
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
