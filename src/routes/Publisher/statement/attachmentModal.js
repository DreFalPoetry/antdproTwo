import React,{Component} from 'react';
import {Modal,Form,AutoComplete,Row,Col,Input,message,Upload,Icon,Button } from 'antd';
import { deepCloneObj } from '../../../utils/commonFunc';
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()

export default class AttachmentModal extends Component{
    state = {
        fileList: [],
    }

    submitFormInfo = () => {
        if(this.state.fileList.length == 0){
            message.error('还未选择上传文件');
            return;
        }else{
            this.handleUpload();
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        formData.forEach(function(file){
            console.log(file)
        })
    
        // You can use any AJAX library you like
        // reqwest({
        //     url: '//jsonplaceholder.typicode.com/posts/',
        //     method: 'post',
        //     processData: false,
        //     data:formData&name='we'&,
        //     success: () => {
        //         this.setState({
        //         fileList: [],
        //         });
        //         message.success('upload successfully.');
        //     },
        //     error: () => {
        //         message.error('upload failed.');
        //     },
        // });
    }

    closeAttachModal = () => {
        this.props.changeVisible(false,this.props.index)
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const uploadProps = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                console.log(file);
                // let tempFileList =deepCloneObj(this.state.fileList);
                // tempFileList.push(file);
                // this.setState({
                //     fileList:tempFileList
                // })
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }),function(){
                    console.log(this.state.fileList);
                });
                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <Modal
                title="备注信息"
                visible={this.props.visible}
                onOk={this.submitFormInfo}
                onCancel={this.closeAttachModal}
                maskClosable={false}
            >
                <Form layout="inline">
                    <Row>
                        <Col> 
                            <FormItem label="Remark" style={{width:'100%'}}>
                                {getFieldDecorator('remark',{
                                    initialValue:this.props.record.deductedReason
                                })(
                                    <TextArea rows={4}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col> 
                        <FormItem label="Upload" style={{width:'100%'}}>
                            <Upload {...uploadProps}>
                                <Button>
                                    <Icon type="upload" /> Select File
                                </Button>
                            </Upload>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}