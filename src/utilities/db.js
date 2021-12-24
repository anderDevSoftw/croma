const TableProjects = "Projects"

class DB {
    constructor(){
        this.db = localStorage;
    }

    set(key,value){
        let v = JSON.stringify(value);
        this.db.setItem(key,v);
    }

    get(key){
        let v = this.db.getItem(key);
        return JSON.parse(v);
    }

    delete(key){
        this.db.removeItem(key);
    }

    setProject(value,id=null){
        let v = this.get(TableProjects);
        v = v?v:[];
        if(id !== null){
            v[id] = value;
        }else{
            id = v.length;
            v = [...v,value];
        }
        this.set(TableProjects,v);
        return id;
    }

    getProjects(){
        let v = this.get(TableProjects);
        v = v?v:[];
        return v;
    }

    getProject(id){
        let v = this.get(TableProjects);
        v = v?v:[];
        return v.find((_,ind) => ind === id);
    }

    deleteProject(id){
        let v = this.get(TableProjects);
        v = v?v:[];
        v = v.filter((_,ind) => ind !== id);
        this.set(TableProjects,v);
    }

    clear(){
        this.db.clear();
    }
}

export default (new DB());