import { Body, Controller, HttpStatus, Logger, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WalletService } from "./wallet.service";
import { CreateWalletDto, CreateWalletResponse } from "./dto/wallet.dto";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {

    private readonly logger = new Logger(WalletController.name);

    constructor(
        private walletService: WalletService
    ) {}

    @ApiOperation({ summary: 'Create New Wallet' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Wallet created successfully', type: CreateWalletResponse })
    @Post("/create")
    async getCredits(
        @Body() createWalletDto: CreateWalletDto,
        @Res() res
    ) {
        try {
            this.logger.log(`Fetching wallet`);

            // fetch wallet
            const wallet = await this.walletService.createWallet(createWalletDto);

            this.logger.log(`Successfully created wallet`);

            return res.status(HttpStatus.CREATED).json({
                message: "wallet created successfully",
                data: {
                    wallet
                }
            })
        } catch (err) {
            this.logger.error(`Failed to create wallet`);

            const {errorMessage, statusCode} = getPrismaErrorStatusAndMessage(err);
            res.status(statusCode).json({
                statusCode, 
                message: errorMessage || "Failed to create wallet",
            });
        }
    }
}