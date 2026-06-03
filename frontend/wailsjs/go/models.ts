export namespace main {
	
	export class JadwalServis {
	    id: number;
	    motor: string;
	    catatan: string;
	    selesai: string;
	
	    static createFrom(source: any = {}) {
	        return new JadwalServis(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.motor = source["motor"];
	        this.catatan = source["catatan"];
	        this.selesai = source["selesai"];
	    }
	}

}

