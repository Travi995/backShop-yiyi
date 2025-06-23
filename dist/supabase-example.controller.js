"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseExampleController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./common/supabase/supabase.service");
let SupabaseExampleController = class SupabaseExampleController {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getUsers() {
        const { data, error } = await this.supabaseService.getClient()
            .from('users')
            .select('*');
        if (error) {
            return { error: error.message };
        }
        return data;
    }
};
exports.SupabaseExampleController = SupabaseExampleController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseExampleController.prototype, "getUsers", null);
exports.SupabaseExampleController = SupabaseExampleController = __decorate([
    (0, common_1.Controller)('supabase-example'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SupabaseExampleController);
//# sourceMappingURL=supabase-example.controller.js.map