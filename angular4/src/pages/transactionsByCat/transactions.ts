import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './transactions.html'
})
export class TransactionsByCat {

    private paramsSubscription;
    private transactions = [];
    private accounts = [];
    private selectedAccount;
    private currentPage;

    constructor(
        private service: Service,
        private route: ActivatedRoute
    ) { 
        this.currentPage = 1;
    }

    ngOnInit() {
        this.service.fetchAccounts().then(
            data => {
                this.accountDataReady(data);
            }
        )
    }

    private scrollToTop() {
        document.body.scrollTo(0,0);
    }

    private accountDataReady(data){
       this.accounts = data.accounts;
       this.paramsSubscription = this.route.params.subscribe(
            params => {
                for(let account of this.accounts){
                    if(account.account_nbr === params['id']){
                        this.selectAccount(account);
                        break;
                    }
                }
            }
        );
    }

    private selectAccount(account){
        this.selectedAccount = account;
        this.selectedAccount.balance = account.balance;
        this.fetchTransactionData(this.selectedAccount, this.currentPage);
    }

    private fetchTransactionData(account, page){
        this.service.fetchTransactionsByCat(account.account_nbr, 'Andet')
        .then(data => {
            console.log(data);
            this.transactions = data['transactions'];
        })
    }

    private getMoreTransactions(){
        this.currentPage++;
        this.service.fetchTransactionsByPage(this.selectedAccount.account_nbr, this.currentPage)
        .then(data => {
            this.transactions = this.transactions.concat(data['transactions']);
        });
    }

    private isAccountSelected(account){
        return account.account_nbr == this.selectedAccount.account_nbr;
    }

    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }
}