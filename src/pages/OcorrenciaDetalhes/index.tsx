import React from 'react';

import { Link } from 'react-router-dom';
import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import {
  Main,
  SectionLeft,
  SectionRight,
  Card,
  CardHeader,
  CardBody,
  AtendimentoContainer,
  Atendimento,
} from './styles';

import moneyTalkLogo from '../../assets/money-talk.svg';
import whatsappLogo from '../../assets/whatsapp.svg';
import infoLogo from '../../assets/info.svg';
import priceTagLogo from '../../assets/price-tag.svg';
import warningLogo from '../../assets/warning.svg';
import Tag from '../../components/Tag';

const OcorrenciaDetalhes: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <SectionLeft>
            <header>
              <div>
                <Link to="/ocorrencias">Voltar</Link>
              </div>
              <Tag className="tagSituacao" theme="warning">
                Aguardando Retorno
              </Tag>
              <h1>Ocorrência | Detalhes</h1>
            </header>
            <Card>
              <CardHeader>
                <h3>Contrato</h3>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <span>Cliente:</span>
                  <div>ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC</div>
                </div>
                <div className="row">
                  <span>Contrato:</span>
                  <div>183-876805000071</div>
                </div>
                <div className="row">
                  <span>Valor de Venda:</span>
                  <div>23.989.92</div>
                </div>
                <div className="row">
                  <span>Produto:</span>
                  <div>TRIAL GRAND VACATION OCEANI - FOR</div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h3>Ocorrencia</h3>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <span>Número:</span>
                  <div>212931</div>
                </div>
                <div className="row">
                  <span>Data:</span>
                  <div>01-03-2021</div>
                </div>
                <div className="row">
                  <span>Status Timesharing:</span>
                  <div>Pendente</div>
                </div>
                <div className="row">
                  <span>Motivo:</span>
                  <div>SOLICITAÇÃO DE CANCELAMENTO 7 DIAS</div>
                </div>
                <div className="row">
                  <span>Responsável:</span>
                  <div>BIANCA</div>
                </div>
                <div className="row">
                  <span>Usuário Cadastro:</span>
                  <div>ANTERO.GUSTAVO</div>
                </div>
                <div className="row">
                  <span>Departamento:</span>
                  <div>ADM TS - RENEGOCIAÇÃO</div>
                </div>
              </CardBody>
            </Card>
          </SectionLeft>

          <SectionRight>
            <header>
              <h3>Atendimentos</h3>
            </header>
            <hr />
            <AtendimentoContainer>
              <Atendimento>
                <header>
                  <img src={moneyTalkLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>NEGOCIAÇÃO</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
              <Atendimento>
                <header>
                  <img src={whatsappLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>WHATSAPP COBRANÇA</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
              <Atendimento>
                <header>
                  <img src={infoLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>CAC - INFORMAÇÃO</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
              <Atendimento>
                <header>
                  <img src={priceTagLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>COBRANÇA</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
              <Atendimento>
                <header>
                  <img src={warningLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>ATENÇÃO</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
              <Atendimento>
                <header>
                  <img src={whatsappLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>WHATSAPP COBRANÇA</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
              <Atendimento>
                <header>
                  <img src={whatsappLogo} alt="moneyTalkLogo" />
                </header>
                <aside>
                  <h4>WHATSAPP COBRANÇA</h4>
                  <span>ANNE GRACIELE</span>
                  <small>26-02-2021</small>
                </aside>
              </Atendimento>
            </AtendimentoContainer>
          </SectionRight>
        </Main>
      </Content>
    </Container>
  );
};

export default OcorrenciaDetalhes;
