import React, { useState, useMemo, useCallback } from 'react';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import WalletBox from '../../components/WalletBox';
import MessageBox from '../../components/MessageBox';
import PieChartBox from '../../components/PieChartBox';

import expenses from '../../repositories/expenses';
import gains from '../../repositories/gains';
import listOfMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinnImg  from '../../assets/grinning.svg';

import { Container, Content } from './styles';
import HistoryBox from '../../components/HistoryBox/indes';
import BarChartBox from '../../components/BarChartBox';

const Dashboard: React.FC = () => {
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() +1);
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
  
  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {value: index + 1, label: month,}
    });
  },[])

  const years = useMemo(() => {
    let uniqueYears: number[] = [];

    [...expenses, ...gains].forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();

        if(!uniqueYears.includes(year))
          uniqueYears.push(year);
    });   
    return uniqueYears.map(year => {
      return {value: year, label: year,}
    });
  },[]);


  const totalExpenses = useMemo(() => {
    let total:number = 0;

    expenses.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() +1;

      if(month === monthSelected && year === yearSelected){
        try{
          total += Number(item.amount)
        } catch {
          throw new Error('Valor invalido!');
        }
      }
    });
    return total;
  },[monthSelected, yearSelected]);

  const totalGains = useMemo(() => {
    let total:number = 0;

    gains.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() +1;

      if(month === monthSelected && year === yearSelected){
        try{
          total += Number(item.amount)
        } catch {
          throw new Error('Valor invalido!');
        }
      }
    });
    return total;
  },[monthSelected, yearSelected]);

  const totalBalance = useMemo(() => {
     return totalGains - totalExpenses;
  }, [totalExpenses, totalGains])

  const message = useMemo(() => {
    if(totalBalance < 0)
      return {
        title: "Que triste!",
        description: "Neste mês você gastou mais do que deveria!",
        footerText: "Verifique seus gastos e tente economizar!",
        icon: sadImg,
      }
    else if(totalBalance === 0 )
      return {
        title: "Ufa!",
        description: "Neste mês você ficou no limite!",
        footerText: "Tenha cuidado!",
        icon: grinnImg,
      }
    else if (totalGains === 0 && totalExpenses === 0 )
    return {
      title: "Ops!",
      description: "Neste mês não há registros de entradas ou saídas",
      footerText: "Parece que você não fez nenhum registro nesse mes/ano!",
      icon: grinnImg,
    }  
    else 
      return {
      title: "Muito bem!",
      description: "Sua carteira está positiva!",
      footerText: "Continue assim, considere investir!",
      icon: happyImg,
    }
  },[totalBalance, totalExpenses, totalGains])

  const relationExpensesXGains = useMemo(() => {
    const total = totalGains + totalExpenses;

    const percentGains = Number(((totalGains / total) * 100).toFixed(1));
    const percentExpenses = Number(((totalExpenses / total) * 100).toFixed(1));

    const data = [
      {name: 'Entradas', value: totalGains ,percent: percentGains ? percentGains : 0 , color: "#E44C4E"},
      {name: 'Saidas', value: totalExpenses ,percent: percentExpenses ? percentExpenses : 0 , color: "#F7931B"}
    ]
    return data;
  },[totalExpenses, totalGains]);

  
  const historyData = useMemo(() => {
    return listOfMonths.map((_, month) => {
      let amountEntry = 0;

      gains.forEach(gain => {
        const date = new Date(gain.date);
        const gainMounth = date.getMonth();
        const gainYear = date.getFullYear();

        if(gainMounth === month && gainYear === yearSelected ){
          try{
            amountEntry += Number(gain.amount);
          }catch{
            throw new Error('Valor invalido');
          }
        }
      });

      let amountOutput = 0;
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const expenseMounth = date.getMonth();
        const expenseYear = date.getFullYear();

        if(expenseMounth === month && expenseYear === yearSelected ){
          try{
            amountOutput += Number(expense.amount);
          }catch{
            throw new Error('Valor invalido');
          }
        }
      });

      return { 
        monthNumber: month,
        month: listOfMonths[month].substr(0,3),
        amountEntry,
        amountOutput
      }
    }).filter(item => {
      const currentMounth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      return (yearSelected === currentYear && item.monthNumber <= currentMounth) || (yearSelected < currentYear);
    });
  },[yearSelected]);

  const relationExpensesRecurrentXEventual = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;

    expenses.filter(expense => {
      const date = new Date(expense.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      return month === monthSelected && year === yearSelected;
    })
    .forEach(expense => {
      if(expense.frequency === 'recorrente') 
        return amountRecurrent += Number(expense.amount);

        if(expense.frequency === 'eventual') 
        return amountEventual += Number(expense.amount);
    });
    
    const total = amountRecurrent + amountEventual;

    const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1));
    const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1));


    return [
      { name: 'Recorrentes', amount: amountRecurrent, percent: recurrentPercent ? recurrentPercent : 0, color: "#F7931B"},
      { name: 'Eventuais', amount: amountEventual, percent: eventualPercent ? eventualPercent : 0 , color: "#E44C4E"},
    ];

  }, [monthSelected, yearSelected])

  const relationGainsRecurrentXEventual = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;

    gains.filter(gain => {
      const date = new Date(gain.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      return month === monthSelected && year === yearSelected;
    })
    .forEach(gain => {
      if(gain.frequency === 'recorrente') 
        return amountRecurrent += Number(gain.amount);

        if(gain.frequency === 'eventual') 
        return amountEventual += Number(gain.amount);
    });
    
    const total = amountRecurrent + amountEventual;

    const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1));
    const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1));

    return [
      { name: 'Recorrentes', amount: amountRecurrent, percent: recurrentPercent ? recurrentPercent : 0 , color: "#F7931B"},
      { name: 'Eventuais', amount: amountEventual, percent: eventualPercent ? eventualPercent : 0, color: "#E44C4E"},
    ];

  }, [monthSelected, yearSelected])

  const handleMonthSelected = useCallback((month: string) => {
    try{
      const parseMonth = Number(month);
      setMonthSelected(parseMonth);
    }
    catch{
      throw new Error('valor invalido para mes')
    }
  },[]);

  const handleYearSelected = useCallback((year: string) => {
    try{
      const parseYear = Number(year);
      setYearSelected(parseYear);
    }
    catch{
      throw new Error('valor invalido para ano')
    }
  },[]);

  return (
    <Container>
      <ContentHeader title="Dashboard" lineColor="#F7931B"> 
      <SelectInput 
          options={months}
          onChange={e => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />
        <SelectInput 
          options={years}
          onChange={e => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
      </ContentHeader>

      <Content>
        <WalletBox 
          title="Saldo"
          color="#4E41F0"
          amount={totalBalance}
          footerLabel="atualizado com base nas entradas e saídas"
          icon="dolar"
        />

        <WalletBox 
          title="Entradas"
          color="#F7931B"
          amount={totalGains}
          footerLabel="atualizado com base nas entradas e saídas"
          icon="arrowUp"
        />

        <WalletBox 
          title="Saídas"
          color="#E44C4E"
          amount={totalExpenses}
          footerLabel="atualizado com base nas entradas e saídas"
          icon="arrowDown"
        />

        <MessageBox 
          title={message.title}
          description={message.description}
          footerText={message.footerText}
          icon={message.icon}
        />

        <PieChartBox data={relationExpensesXGains} />

        <HistoryBox 
          data={historyData}
          lineColorAmountEntry="#F7931B"
          lineColorAmountOutput="#E44C4E"   
        />
        
        <BarChartBox 
          title="Saídas"
          data={relationExpensesRecurrentXEventual}
        />

        <BarChartBox
        title="Entradas"
        data={relationGainsRecurrentXEventual}
        />

      </Content>
    </Container>
  );
}

export default Dashboard;