// -*- mode: typescript; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of Genie
//
// Copyright 2021 The Board of Trustees of the Leland Stanford Junior University
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Tp from 'thingpedia';

export default class LocalTable<RowType> {
    name : string;
    private _baseUrl : string;
    private _userId : number;

    constructor(name : string, baseUrl : string, userId : number) {
        this.name = name;
        this._baseUrl = baseUrl;
        this._userId = userId;
    }

    async getAll() : Promise<RowType[]> {
        const resp = await Tp.Helpers.Http.get(`${this._baseUrl}/localtable/user_${this.name}/${this._userId}`);
        return JSON.parse(resp)['data'];
    }

    async getOne(uniqueId : string) : Promise<RowType|undefined> {
        try {
            const resp = await Tp.Helpers.Http.get(`${this._baseUrl}/localtable/user_${this.name}/${this._userId}/${encodeURIComponent(uniqueId)}`);
            return JSON.parse(resp)['data'];
        } catch(err) {
            if (err.code === 404)
                return undefined;
            throw err;
        }
    }

    async getBy(field : keyof RowType, value : string) : Promise<RowType[]> {
        const resp = await Tp.Helpers.Http.get(`${this._baseUrl}/localtable/user_${this.name}/by-${field}/${this._userId}/${encodeURIComponent(value)}`);
        return JSON.parse(resp)['data'];
    }

    async insertOne(uniqueId : string, row : Omit<RowType, "uniqueId">) : Promise<void> {
        await Tp.Helpers.Http.post(`${this._baseUrl}/localtable/user_${this.name}/${this._userId}/${encodeURIComponent(uniqueId)}`,
                JSON.stringify(row), { dataContentType: 'application/json' });
    }

    async deleteOne(uniqueId : string) : Promise<void> {
        await Tp.Helpers.Http.request(`${this._baseUrl}/localtable/user_${this.name}/${this._userId}/${encodeURIComponent(uniqueId)}`,
                'DELETE', null, {});
    }
}
