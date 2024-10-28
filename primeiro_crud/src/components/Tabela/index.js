import './Tabela.css';
import React from 'react';

class Tabela extends React.Component{    
    
    constructor(props){
        super(props);

        this.state ={
            id: 0,
            nome: '',
            email: '',
            funcionarios : []
        }
    }
    

    componentDidMount(){
        this.buscarFuncionario();
    }

    componentWillUnmount(){

    }

    buscarFuncionario(){
        fetch("http://localhost:8080/funcionario")
        .then(retorno => retorno.json())
        .then(retorno_convertido => {
            this.setState({ funcionarios : retorno_convertido })
        });
    }

    deletarFuncionario = (id) => {
        fetch("http://localhost:8080/funcionario/"+id, {method : 'DELETE'})
        .then(retorno => {
            if(retorno.ok){
                this.buscarFuncionario();
            }
        })
    }

    carregarDados = (id) => {
        fetch("http://localhost:8080/funcionario/"+id, {method : 'GET'})
        .then(retorno => retorno.json())
        .then(funcionario => {
            this.setState({ 
                id: funcionario.id,
                nome: funcionario.nome,
                email: funcionario.email
            })
        });
    }

    atualizarFuncionario = (funcionario) => {
        fetch("http://localhost:8080/funcionario/"+funcionario.id, {
            method : 'PUT',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(funcionario)
        })
        .then(retorno => {
            if(retorno.ok){
                this.buscarFuncionario();
            }else{
                alert("Nao foi possivel atualizar o funcionario = ");
            }
        })
    }

    cadastraFuncionario = (funcionario) => {
        fetch("http://localhost:8080/funcionario", {
            method : 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(funcionario)
        })
        .then(retorno => {
            if(retorno.ok){
                this.buscarFuncionario();
            }else{
                alert("Nao foi possivel cadastrar");
            }
        })
    }
    
    renderTabela(){
        return(
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.funcionarios.map((funcionario, indice) =>
                                <tr>
                                    <td>{indice + 1}</td>
                                    <td>{funcionario.nome}</td>
                                    <td>{funcionario.email}</td>
                                    <td>
                                        <button onClick={() => this.carregarDados(funcionario.id)} >Alterar</button> 
                                        <button onClick={() => this.deletarFuncionario(funcionario.id)}>Excluir</button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
        );
    }

    atualizaNome = (evento) => {
        this.setState(
            {
                nome: evento.target.value
            }
        )
    }
    
    atulizaEmail = (evento) => {
        this.setState(
            {
                email: evento.target.value
            }
        )
    }
    
    submit = () => {

        if(this.state.id == 0){
            const funcionario = {
                nome: this.state.nome,
                email: this.state.email
            }
    
            this.cadastraFuncionario(funcionario);
        }else{

            const funcionario = {
                id: this.state.id,
                nome: this.state.nome,
                email: this.state.email
                }
                this.atualizarFuncionario(funcionario);
        }
    }

    reset = () => {
        this.setState(
            {
                id: 0,
                nome: '',
                email: ''
            }
        )
    }

    render(){
        return(
            <div> 
                <form>
                    <label>ID:</label>
                    <input type='text' value={this.state.id} readOnly={true} />
                    <input type="text" name="nome" placeholder='Nome' value={this.state.nome} onChange={this.atualizaNome} />
                    <input type="text" name="email" placeholder='Email' value={this.state.email} onChange={this.atulizaEmail} />

                    <section>
                        <input type="button" value="Cadastar" onClick={this.submit} />
                        <input type="button" value="Limpar" onClick={this.reset} /> 
                    </section>
                </form>
                
                {this.renderTabela()}
            </div>
        );  
    }
}

export default Tabela