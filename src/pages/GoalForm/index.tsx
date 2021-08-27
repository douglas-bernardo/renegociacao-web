import React, { useRef, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { TiArrowLeftThick } from 'react-icons/ti';
import * as Yup from 'yup';
import { OptionTypeBase } from 'react-select';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useToast } from '../../hooks/toast';

import Loading from '../../components/Loading';
import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Select from '../../components/Select';

import { Main, ContainerRegister, Form, GoalsMonthBoard } from './styles';
import getValidationErros from '../../utils/getValidationErros';
import Input from '../../components/Input';
import LoadingModal from '../../components/LoadingModal';
import { api } from '../../services/api';

import BreadCrumb from '../../components/BreadCrumb';
import BreadCrumbItem from '../../components/BreadCrumbItem';

interface LocationProps {
  id?: number | undefined;
}

interface GoalType {
  id: number;
  name: string;
}

interface MonthGoal {
  month_number: number;
  target: number;
}

interface Goal {
  id: number;
  current_year: number;
  goal_type_id: number;
  description: string;
  active: boolean;
  months: MonthGoal[];
  goal_type: {
    id: number;
    name: string;
  };
}

interface GoalResponse {
  status: string;
  data: Goal;
}

interface Month {
  month_number: number;
  name: string;
}

const GoalForm: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const [showLoadingModal, setLoadingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);
  const location = useLocation<LocationProps>();

  const [goalTypeOptions, setGoalTypeOptions] = useState<OptionTypeBase[]>([]);

  const [goal, setGoal] = useState<Goal | null>(null);

  const monthsGoalOptions: Month[] = useMemo(() => {
    const monthsNumbers = Array.from({ length: 12 }, (v, k) => k + 1);
    return monthsNumbers.map(m => {
      return {
        month_number: m,
        name: format(new Date(new Date().getFullYear(), m - 1, 1), 'MMMM', {
          locale: ptBR,
        }),
      };
    });
  }, []);

  useEffect(() => {
    api.get('/domain/goal-type').then(response => {
      const { data } = response.data;
      setGoalTypeOptions(
        data.map((item: GoalType) => {
          return { value: item.id, label: item.name };
        }),
      );
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (location.state?.id) {
      api
        .get<GoalResponse>(`/domain/goal/${location.state?.id}`)
        .then(response => {
          const { data } = response.data;
          setGoal(data);

          const current = goalTypeOptions.find(opt => {
            return opt.value === data.goal_type.id;
          });
          formRef.current?.setFieldValue('goal_type_id', {
            value: current?.value,
            label: current?.label,
          });

          data.months.forEach(element => {
            formRef.current?.setFieldValue(
              element.month_number.toString(),
              String(element.target).replace('.', ',').padStart(5, '0'),
            );
          });
        });
    }
  }, [location.state?.id, goalTypeOptions]);

  const handleButtonSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: Goal) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          current_year: Yup.string().min(4, 'Ano inválido'),
          goal_type_id: Yup.string().required('Tipo de Meta é obrigatório'),
          1: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          2: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          3: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          4: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          5: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          6: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          7: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          8: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          9: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          10: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          11: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
          12: Yup.string().min(5, 'Meta inválida. Preencha no formato 00,00'),
        });

        await schema.validate(data, { abortEarly: false });

        const discard = ['current_year', 'goal_type_id', 'description'];
        const monthsGoals = Object.keys(data)
          .filter(key => discard.indexOf(key) === -1 && data[key] !== '00,00')
          .map(key => {
            return {
              month_number: key,
              target: String(data[key]).replace(',', '.'),
            };
          });

        setLoadingModal(true);

        if (location.state?.id) {
          await api.put(`/domain/goal/${location.state?.id}`, {
            current_year: data.current_year,
            goal_type_id: data.goal_type_id,
            description: data.description ?? '',
            months: monthsGoals,
          });
        } else {
          await api.post('/domain/goal', {
            current_year: data.current_year,
            goal_type_id: data.goal_type_id,
            description: data.description ?? '',
            months: monthsGoals,
          });
        }

        setLoadingModal(false);
        addToast({
          type: 'success',
          title: 'Cadastro Metas',
          description: location.state?.id
            ? 'Dados alterados com sucesso!'
            : 'Metas cadastradas com sucesso!',
        });

        history.push('/settings/goals');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        setLoadingModal(false);
        addToast({
          type: 'error',
          title: `Não Permitido`,
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
        window.scrollTo(0, 0);
      }
    },
    [addToast, history, location.state?.id],
  );

  return (
    <Container>
      <Sidebar />
      <Content>
        <LoadingModal isOpen={showLoadingModal} />
        <Header />
        <Main>
          <MainHeader>
            <BreadCrumb>
              <BreadCrumbItem link="/settings" label="Configurações" />
              <BreadCrumbItem link="/settings/goals" label="Metas" />
              <BreadCrumbItem label={location.state?.id ? 'Editar' : 'Novo'} />
            </BreadCrumb>
          </MainHeader>
          <div className="linkBackPage">
            <Link to="/settings/goals">
              <TiArrowLeftThick size={25} />
              <span>Voltar</span>
            </Link>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <ContainerRegister>
              <Form ref={formRef} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="label">Ano Vigência:</div>
                  <Input
                    name="current_year"
                    mask="number"
                    maxLength={4}
                    defaultValue={goal?.current_year}
                  />
                </div>

                <div className="row">
                  <div className="label">Tipo de Meta:</div>
                  <Select
                    name="goal_type_id"
                    options={goalTypeOptions}
                    menuPlacement="auto"
                    placeholder="Selecione o tipo de meta"
                  />
                </div>

                <div className="row">
                  <div className="label">Descrição:</div>
                  <Input name="description" defaultValue={goal?.description} />
                </div>

                <GoalsMonthBoard>
                  <header>
                    <p>
                      Preencha os meses de acordo com as respectivas metas
                      (Preencha no formato 00,00):
                    </p>
                  </header>
                  <main>
                    {monthsGoalOptions &&
                      monthsGoalOptions.map(month => (
                        <div key={month.month_number} className="goalItem">
                          <div className="label">{month.name}</div>
                          <Input
                            name={`${month.month_number}`}
                            mask="currency"
                            maxLength={5}
                            defaultValue="00,00"
                          />
                        </div>
                      ))}
                  </main>
                </GoalsMonthBoard>
              </Form>
              <button
                type="button"
                className="roleSubmit"
                onClick={handleButtonSubmit}
              >
                <p className="text">Salvar</p>
              </button>
            </ContainerRegister>
          )}
        </Main>
      </Content>
    </Container>
  );
};

export default GoalForm;
